module challenge::arena;

use challenge::hero::{Self, Hero};
use sui::event;
use sui::object::{Self, UID, ID};
use sui::tx_context::TxContext;

// ========= СТРУКТУРЫ / STRUCTS =========

// Структура для представления арены с уникальным ID, героем-воином и адресом владельца
// Structure representing an arena with a unique ID, warrior hero, and owner's address
public struct Arena has key, store {
    id: UID,
    warrior: Hero,
    owner: address,
}

// ========= СОБЫТИЯ / EVENTS =========

// Событие создания арены (для логирования)
// Event emitted when an arena is created
public struct ArenaCreated has copy, drop {
    arena_id: ID, // ID арены
    timestamp: u64, // Время создания
}

// Событие завершения битвы
// Event emitted when a battle completes
public struct ArenaCompleted has copy, drop {
    winner_hero_id: ID,
    loser_hero_id: ID,
    timestamp: u64,
}

// ========= ФУНКЦИИ / FUNCTIONS =========

// Функция создания арены с героем-воином
// Function to create an arena with a warrior hero
public fun create_arena(hero: Hero, ctx: &mut TxContext) {
    // Шаг 1: создаем уникальный ID для арены
    // Step 1: create a unique ID for the arena
    let id = object::new(ctx);

    // Шаг 2: создаем арену, указываем героя и владельца (тот, кто вызывает транзакцию)
    // Step 2: initialize arena struct with hero and owner (ctx.sender())
    let arena = Arena {
        id,
        warrior: hero,
        owner: ctx.sender(),
    };

    // Шаг 3: логируем событие создания арены с ID и временем
    // Step 3: emit ArenaCreated event with ID and timestamp
    let event = ArenaCreated {
        arena_id: object::id(&arena), // Получаем ID объекта арены
        timestamp: ctx.epoch_timestamp_ms(), // Время создания
    };
    event::emit(event); // Отправляем событие

    // Делаем объект арены общедоступным
    transfer::share_object(arena);
}

// Функция битвы между входящим героем и героем из арены
// Function to battle between input hero and arena's warrior
#[allow(lint(self_transfer))]
public fun battle(hero: Hero, arena: Arena, ctx: &mut TxContext) {
    // Шаг 1: разбираем арену на части — ID, воин и владелец
    // Step 1: destructure arena to extract id, warrior, and owner
    let Arena { id, warrior, owner } = arena;

    // Шаг 2: сравниваем силу героев
    // Step 2: compare hero power levels
    let challenger_power = hero::hero_power(&hero);
    let defender_power = hero::hero_power(&warrior);

    if (challenger_power > defender_power) {
        // Если входящий герой сильнее
        // If challenger hero wins

        // Отправляем обоих героев победителю (отправителю транзакции)
        // Transfer both heroes to the challenger (ctx.sender())
        transfer::public_transfer(warrior, ctx.sender());

        // Логируем победу
        // Emit ArenaCompleted event
        event::emit(ArenaCompleted {
            winner_hero_id: object::id(&hero),
            loser_hero_id: object::id(&warrior),
            timestamp: ctx.epoch_timestamp_ms(),
        });
    } else {
        // Если воин арены побеждает

        // Отправляем обоих героев владельцу арены
        // Transfer both heroes to arena owner
        transfer::public_transfer(hero, owner);
        transfer::public_transfer(warrior, owner);

        // Логируем результат
        // Emit ArenaCompleted event
        event::emit(ArenaCompleted {
            winner_hero_id: object::id(&warrior),
            loser_hero_id: object::id(&hero),
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    // Шаг 3: удаляем арену, так как бой завершен
    // Step 3: delete the arena object (battle completed)
    object::delete(id);
}
