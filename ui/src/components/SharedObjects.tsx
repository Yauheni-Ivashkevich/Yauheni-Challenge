import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Grid, Button, Badge, TextField, Tabs, Separator } from "@radix-ui/themes";
import { useState } from "react";
import { useNetworkVariable } from "../networkConfig";
import { ListHero } from "../types/hero";
import { buyHero } from "../utility/marketplace/buy_hero";
import { delist } from "../utility/admin/delist";
import { changePrice } from "../utility/admin/change_price";
import { RefreshProps } from "../types/props";

export default function SharedObjects({ refreshKey, setRefreshKey }: RefreshProps) {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const suiClient = useSuiClient();
  const [isBuying, setIsBuying] = useState<{ [key: string]: boolean }>({});
  const [isDelisting, setIsDelisting] = useState<{ [key: string]: boolean }>({});
  const [isChangingPrice, setIsChangingPrice] = useState<{ [key: string]: boolean }>({});
  const [newPrice, setNewPrice] = useState<{ [key: string]: string }>({});
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { data: adminCap } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: {
        StructType: `${packageId}::marketplace::AdminCap`
      },
      options: {
        showContent: true,
        showType: true
      }
    },
    {
      enabled: !!account && !!packageId,
      queryKey: ["getOwnedObjects", "AdminCap", account?.address, packageId, refreshKey],
    }
  );

  const isAdmin = (adminCap?.data?.length ?? 0) > 0;
  const adminCapId = adminCap?.data?.[0]?.data?.objectId;

  const { data: listedEvents, isPending: eventsLoading } = useSuiClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${packageId}::marketplace::HeroListed`
      },
      limit: 50,
      order: "descending"
    },
    {
      enabled: !!packageId,
      queryKey: ["queryEvents", packageId, "HeroListed", refreshKey],
    }
  );

  const { data, isPending, error } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: listedEvents?.data?.map(event => (event.parsedJson as any).list_hero_id) || [],
      options: {
        showContent: true,
        showType: true
      }
    },
    {
      enabled: !!packageId && listedEvents?.data !== undefined,
      queryKey: ["multiGetObjects", listedEvents?.data?.map(event => (event.parsedJson as any).list_hero_id), refreshKey],
    }
  );

  const handleBuy = (listHeroId: string, price: string) => {
    if (!account || !packageId) return;
    
    setIsBuying(prev => ({ ...prev, [listHeroId]: true }));
    
    const tx = buyHero(packageId, listHeroId, price);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          setRefreshKey(refreshKey + 1);
          setIsBuying(prev => ({ ...prev, [listHeroId]: false }));
        },
        onError: () => {
          setIsBuying(prev => ({ ...prev, [listHeroId]: false }));
        }
      }
    );
  };

  const handleDelist = (listHeroId: string) => {
    if (!isAdmin || !adminCapId || !packageId) return;
    
    setIsDelisting(prev => ({ ...prev, [listHeroId]: true }));
    
    const tx = delist(packageId, listHeroId, adminCapId);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          setRefreshKey(refreshKey + 1);
          setIsDelisting(prev => ({ ...prev, [listHeroId]: false }));
        },
        onError: () => {
          setIsDelisting(prev => ({ ...prev, [listHeroId]: false }));
        }
      }
    );
  };

  const handleChangePrice = (listHeroId: string, price: string) => {
    if (!isAdmin || !adminCapId || !packageId || !price.trim()) return;
    
    setIsChangingPrice(prev => ({ ...prev, [listHeroId]: true }));
    
    const tx = changePrice(packageId, listHeroId, price, adminCapId);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          setNewPrice(prev => ({ ...prev, [listHeroId]: "" }));
          setRefreshKey(refreshKey + 1);
          setIsChangingPrice(prev => ({ ...prev, [listHeroId]: false }));
        },
        onError: () => {
          setIsChangingPrice(prev => ({ ...prev, [listHeroId]: false }));
        }
      }
    );
  };

  if (error) {
    return (
      <Card>
        <Text color="red">Error loading listed heroes: {error.message}</Text>
      </Card>
    );
  }

  if (eventsLoading || isPending || !data) {
    return (
      <Card>
        <Text>Loading marketplace...</Text>
      </Card>
    );
  }

  if (!listedEvents?.data?.length) {
    return (
      <Flex direction="column" gap="4">
        <Heading size="5">Hero Marketplace (0)</Heading>
        <Card>
          <Text>No heroes are currently listed for sale</Text>
        </Card>
      </Flex>
    );
  }


  const listedHeroes = data.filter(obj => obj.data?.content && 'fields' in obj.data.content);

  return (
    <Flex direction="column" gap="4">
      <Flex justify="between" align="center">
        <Heading size="6">Hero Marketplace ({listedHeroes.length})</Heading>
        {isAdmin && (
          <Badge color="red" size="2">
            Admin Panel Active
          </Badge>
        )}
      </Flex>
      
      {listedHeroes.length === 0 ? (
        <Card>
          <Text>No heroes are currently listed for sale</Text>
        </Card>
      ) : (
        <Grid columns="3" gap="4">
          {listedHeroes.map((obj) => {
            const listHero = obj.data?.content as any;
            const listHeroId = obj.data?.objectId!;
            const fields = listHero.fields as ListHero;
            const heroFields = fields.nft.fields;
            const priceInSui = Number(fields.price) / 1_000_000_000;

            return (
              <Card key={listHeroId} style={{ padding: "16px" }}>
                <Flex direction="column" gap="3">
                  {/* Hero Image */}
                  <img 
                    src={heroFields.image_url} 
                    alt={heroFields.name}
                    style={{ 
                      width: "100%", 
                      height: "200px", 
                      objectFit: "cover", 
                      borderRadius: "8px" 
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  {/* Hero Info */}
                  <Flex direction="column" gap="2">
                    <Flex align="center" gap="2">
                      <Text size="5" weight="bold">{heroFields.name}</Text>
                      {fields.seller === account?.address && (
                        <Badge color="orange" size="1">
                          Your Listing
                        </Badge>
                      )}
                    </Flex>
                    <Badge color="blue" size="2">Power: {heroFields.power}</Badge>
                    <Badge color="green" size="2">Price: {priceInSui.toFixed(2)} SUI</Badge>
                    
                    <Text size="3" color="gray">
                      Seller: {fields.seller.slice(0, 6)}...{fields.seller.slice(-4)}
                    </Text>
                  </Flex>

                  {/* Buy Button - Anyone can buy including owner */}
                  <Button 
                    onClick={() => handleBuy(listHeroId, priceInSui.toString())}
                    disabled={!account || isBuying[listHeroId]}
                    loading={isBuying[listHeroId]}
                    color="green"
                  >
                    {!account 
                      ? "Connect Wallet to Buy" 
                      : isBuying[listHeroId]
                        ? "Buying..."
                        : `Buy for ${priceInSui.toFixed(2)} SUI`
                    }
                  </Button>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <>
                      <Separator size="4" />
                      <Flex direction="column" gap="3" style={{ 
                        backgroundColor: "var(--red-2)", 
                        padding: "12px", 
                        borderRadius: "8px",
                        border: "1px solid var(--red-6)"
                      }}>
                        <Flex align="center" gap="2">
                          <Text size="3" weight="bold" color="red">Admin Panel</Text>
                        </Flex>
                        
                        <Tabs.Root defaultValue="delist">
                          <Tabs.List size="2" style={{ width: "100%" }}>
                            <Tabs.Trigger value="delist" style={{ flex: 1 }}>
                              Delist
                            </Tabs.Trigger>
                            <Tabs.Trigger value="price" style={{ flex: 1 }}>
                              Change Price
                            </Tabs.Trigger>
                          </Tabs.List>

                          <Tabs.Content value="delist">
                            <Flex direction="column" gap="2" mt="3">
                              <Text size="2" color="gray">
                                Remove this hero from the marketplace
                              </Text>
                              <Button 
                                onClick={() => handleDelist(listHeroId)}
                                disabled={isDelisting[listHeroId]}
                                loading={isDelisting[listHeroId]}
                                color="red"
                                size="2"
                                style={{ width: "100%" }}
                              >
                                {isDelisting[listHeroId] ? "Delisting..." : "Delist Hero"}
                              </Button>
                            </Flex>
                          </Tabs.Content>

                          <Tabs.Content value="price">
                            <Flex direction="column" gap="2" mt="3">
                              <Text size="2" color="gray">
                                Current price: {priceInSui.toFixed(2)} SUI
                              </Text>
                              <TextField.Root
                                placeholder="Enter new price in SUI"
                                type="number"
                                size="2"
                                value={newPrice[listHeroId] || ""}
                                onChange={(e) => setNewPrice(prev => ({
                                  ...prev,
                                  [listHeroId]: e.target.value
                                }))}
                              />
                              <Button 
                                onClick={() => handleChangePrice(listHeroId, newPrice[listHeroId])}
                                disabled={!newPrice[listHeroId]?.trim() || isChangingPrice[listHeroId]}
                                loading={isChangingPrice[listHeroId]}
                                color="orange"
                                size="2"
                                style={{ width: "100%" }}
                              >
                                {isChangingPrice[listHeroId] ? "Updating Price..." : "Update Price"}
                              </Button>
                            </Flex>
                          </Tabs.Content>
                        </Tabs.Root>
                      </Flex>
                    </>
                  )}
                </Flex>
              </Card>
            );
          })}
        </Grid>
      )}
    </Flex>
  );
}
