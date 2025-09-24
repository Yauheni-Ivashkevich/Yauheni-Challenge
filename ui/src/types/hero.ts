export interface Hero {
  uid: {
    id: string;
  };
  name: string;
  image_url: string;
  power: string;
}

export interface ListHero {
  uid: {
    id: string;
  };
  nft: {
    fields: Hero;
  };
  price: string;
  seller: string;
}

export interface HeroListedEvent {
  id: string;
  price: string;
  seller: string;
  timestamp: string;
}

export interface HeroBoughtEvent {
  id: string;
  price: string;
  buyer: string;
  seller: string;
  timestamp: string;
}

export interface Arena {
  uid: { id: string };
  warrior: { fields: Hero };
  owner: string;
}

export interface AdminCap {
  uid: {
    id: string;
  };
}

export interface ArenaCreatedEvent {
  id: string;
  timestamp: string;
}

export interface ArenaCompletedEvent {
  winner: string;
  loser: string;
  timestamp: string;
}
