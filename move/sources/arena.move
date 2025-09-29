module challenge::arena;

use challenge::hero::{Hero, hero_power}; // Импорт структуры Героя и функции hero_power
use sui::event;                           // Импорт событий
use sui::object::{new, id, delete};      // Работа с объектами (создание UID, получение ID, удаление)
use sui::transfer::{public_transfer, share_object}; // Передача и публикация объектов
use sui::tx_context::{sender, epoch_timestamp_ms}; // Получить адрес отправителя и текущее время

        
// ========= STRUCTS =========

public struct Arena has key, store {
    id: UID,           // уникальный идентификатор арены // RU: уникальный ID арены
    warrior: Hero,     // герой, выставленный на арену // RU: герой в арене
    owner: address,    // владелец арены // RU: владелец арены
}

// ========= EVENTS =========

public struct ArenaCreated has copy, drop {
    arena_id: ID,       // ID арены // RU: ID арены
    timestamp: u64,     // время создания // RU: время создания
}

public struct ArenaCompleted has copy, drop {
    winner_hero_id: ID, // ID героя победителя // RU: ID героя победителя
    loser_hero_id: ID,  // ID героя проигравшего // RU: ID героя проигравшего
    timestamp: u64,     // время окончания боя // RU: время окончания боя
}

// ========= FUNCTIONS =========

public fun create_arena(hero: Hero, ctx: &mut TxContext) {
    // EN: Step 1: Create new Arena object with unique ID, hero and owner
    // RU: Шаг 1: Создаём новый объект арены с уникальным ID, героем и владельцем
    let arena = Arena {
        id: new(ctx),            // создаём новый UID // RU: новый UID
        warrior: hero,           // кладём переданного героя // RU: используем переданного героя
        owner: sender(ctx),      // владелец — адрес отправителя // RU: владелец — адрес отправителя
    };

    // EN: Step 2: Emit ArenaCreated event with arena ID and timestamp
    // RU: Шаг 2: Генерируем событие о создании арены с ID и временем
    event::emit(ArenaCreated {
        arena_id: id(&arena),
        timestamp: epoch_timestamp_ms(ctx),
    });

    // EN: Step 3: Share arena object publicly so anyone can access
    // RU: Шаг 3: Делаем арену публичной (шарим)
    share_object(arena);
}

#[allow(lint(self_transfer))]
public fun battle(hero: Hero, arena: Arena, ctx: &mut TxContext) {
    // EN: Step 1: Destructure arena to get its fields
    // RU: Шаг 1: Деструктурируем арену, чтобы получить её поля
    let Arena { id: arena_uid, warrior, owner } = arena;

    // EN: Step 2: Get powers of both heroes
    // RU: Шаг 2: Получаем силу обоих героев
    let hero_pwr = hero_power(&hero);
    let warrior_pwr = hero_power(&warrior);

    // EN: Step 3: Get IDs of both heroes
    // RU: Шаг 3: Получаем ID обоих героев
    let hero_id_val = id(&hero);
    let warrior_id_val = id(&warrior);

    // EN: Step 4: Compare powers and transfer heroes accordingly
    // RU: Шаг 4: Сравниваем силы и передаём героев соответствующему владельцу
    if (hero_pwr > warrior_pwr) {
        // EN: Hero wins — transfer both heroes to sender
        // RU: Герой победил — передаём обоих героев отправителю
        public_transfer(hero, sender(ctx));
        public_transfer(warrior, sender(ctx));

        // EN: Emit ArenaCompleted event
        // RU: Генерируем событие о завершении боя
        event::emit(ArenaCompleted {
            winner_hero_id: hero_id_val,
            loser_hero_id: warrior_id_val,
            timestamp: epoch_timestamp_ms(ctx),
        });
    } else {
        // EN: Warrior wins — transfer both heroes to arena owner
        // RU: Воин победил — передаём обоих героев владельцу арены
        public_transfer(hero, owner);
        public_transfer(warrior, owner);

        // EN: Emit ArenaCompleted event
        // RU: Генерируем событие о завершении боя
        event::emit(ArenaCompleted {
            winner_hero_id: warrior_id_val,
            loser_hero_id: hero_id_val,
            timestamp: epoch_timestamp_ms(ctx),
        });
    };

    // EN: Step 5: Delete arena UID (arena is closed)
    // RU: Шаг 5: Удаляем объект арены (арена закрыта)
    delete(arena_uid);
}
