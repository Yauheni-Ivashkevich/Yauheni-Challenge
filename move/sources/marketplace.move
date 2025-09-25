module challenge::marketplace;

use challenge::hero::Hero;
use sui::coin::{Self, Coin};
use sui::event;
use sui::object;
use sui::sui::SUI;
use sui::tx_context::TxContext;

// ========= ERRORS =========

const EInvalidPayment: u64 = 1; // Ошибка при неправильной оплате // Error thrown when payment does not match price

// ========= STRUCTS =========

// Структура для хранения информации о листинге героя на маркетплейсе
// Structure to represent a listed hero in the marketplace
public struct ListHero has key, store {
    id: UID,              // Уникальный ID // Unique ID
    nft: Hero,            // NFT героя // Hero NFT
    price: u64,           // Цена // Listing price
    seller: address,      // Адрес продавца // Seller address
}

// ========= CAPABILITIES =========

// Админская структура — только тот, у кого есть AdminCap, может выполнять админ-функции
// Admin-only capability to restrict access to admin functions
public struct AdminCap has key, store {
    id: UID,
}

// ========= EVENTS =========

// Событие при размещении героя на маркетплейс
// Emitted when a hero is listed
public struct HeroListed has copy, drop {
    list_hero_id: ID,     // ID листинга // Listing ID
    price: u64,           // Цена // Price
    seller: address,      // Адрес продавца // Seller
    timestamp: u64,       // Время // Timestamp
}

// Событие при покупке героя
// Emitted when a hero is bought
public struct HeroBought has copy, drop {
    list_hero_id: ID,     // ID листинга // Listing ID
    price: u64,           // Цена // Price
    buyer: address,       // Покупатель // Buyer
    seller: address,      // Продавец // Seller
    timestamp: u64,       // Время // Timestamp
}

// ========= FUNCTIONS =========

fun init(ctx: &mut TxContext) {
    // Эта функция вызывается один раз при публикации модуля
    // This function is called once when the module is published

    // Создаём новый объект AdminCap
    // Create a new AdminCap object
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };

    // Передаём его владельцу модуля (ctx.sender())
    // Transfer it to the module publisher
    transfer::public_transfer(admin_cap, ctx.sender());
}

public fun list_hero(nft: Hero, price: u64, ctx: &mut TxContext) {
    // Размещаем героя на маркетплейсе
    // List a hero on the marketplace

    // Создаём листинг объекта с уникальным ID
    // Create listing object with unique ID
    let list_hero = ListHero {
        id: object::new(ctx),
        nft,
        price,
        seller: ctx.sender(),
    };

    // Отправляем событие листинга // Emit HeroListed event
    event::emit(HeroListed {
        list_hero_id: object::id(&list_hero),
        price,
        seller: ctx.sender(),
        timestamp: ctx.epoch_timestamp_ms(),
    });

    // Делаем листинг публично доступным // Make listing shared
    transfer::share_object(list_hero);
}

#[allow(lint(self_transfer))]
public fun buy_hero(list_hero: ListHero, coin: Coin<SUI>, ctx: &mut TxContext) {
    // Функция покупки героя // Buying a hero

    // Распаковываем объект листинга // Destructure list object
    let ListHero { id, nft, price, seller } = list_hero;

    // Проверяем, что количество монет соответствует цене
    // Ensure the coin value matches listing price
    assert!(coin::value(&coin) == price, EInvalidPayment);

    // Переводим оплату продавцу // Transfer payment
    transfer::public_transfer(coin, seller);

    // Переводим NFT герою покупателю // Transfer hero NFT to buyer
    transfer::public_transfer(nft, ctx.sender());

    // Отправляем событие о покупке героя // Emit HeroBought event
    event::emit(HeroBought {
        list_hero_id: object::uid_to_inner(&id),
        price,
        buyer: ctx.sender(),
        seller,
        timestamp: ctx.epoch_timestamp_ms(),
    });

    // Удаляем объект листинга // Delete listing object
    object::delete(id);
}

// ========= ADMIN FUNCTIONS =========

public fun delist(_: &AdminCap, list_hero: ListHero) {
    // Только админ может удалить листинг
    // Only admin can delist the hero

    let ListHero { id, nft, price: _, seller } = list_hero;

    // Возвращаем NFT герою продавцу // Return hero to seller
    transfer::public_transfer(nft, seller);

    // Удаляем листинг // Delete listing object
    object::delete(id);
}

public fun change_the_price(_: &AdminCap, list_hero: &mut ListHero, new_price: u64) {
    // Только админ может изменить цену // Only admin can change price

    // Обновляем поле цены // Update price field
    list_hero.price = new_price;
}

// ========= GETTER FUNCTIONS =========

#[test_only]
public fun listing_price(list_hero: &ListHero): u64 {
    list_hero.price
}

// ========= TEST ONLY FUNCTIONS =========

#[test_only]
public fun test_init(ctx: &mut TxContext) {
    let admin_cap = AdminCap {
        id: object::new(ctx),
    };
    transfer::transfer(admin_cap, ctx.sender());
}
