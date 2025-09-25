module challenge::hero;

use std::string::String;
use sui::object::{Self, UID, ID};
use sui::tx_context::TxContext;

// ========= СТРУКТУРЫ (STRUCTS) =========

/// Структура для героя (NFT-персонажа)
/// Hero struct represents a character with a name, image, and power.
public struct Hero has key, store {
    id: UID,                  // Уникальный ID объекта / Unique object ID
    name: String,             // Имя героя / Hero name
    image_url: String,        // URL изображения героя / Hero image URL
    power: u64,               // Сила героя / Hero's power level
}

/// Метаданные для отслеживания героя
/// Metadata struct for tracking creation timestamp of a hero
public struct HeroMetadata has key, store {
    id: UID,              // Уникальный ID / Unique ID
    timestamp: u64,       // Время создания / Creation timestamp in milliseconds
}

// ========= ФУНКЦИЯ СОЗДАНИЯ ГЕРОЯ =========

/// Создает нового героя и передает его владельцу
/// Creates a new hero with the given data and sends it to the creator
#[allow(lint(self_transfer))]
public fun create_hero(
    name: String, 
    image_url: String, 
    power: u64, 
    ctx: &mut TxContext
) {
    // Шаг 1: создаем уникальный идентификатор для героя
    // Step 1: Create unique ID for the hero
    let hero_id = object::new(ctx);

    // Шаг 2: создаем сам объект Hero с переданными параметрами
    // Step 2: Construct the Hero object with provided data
    let hero = Hero {
        id: hero_id,
        name,
        image_url,
        power,
    };

    // Шаг 3: передаем героя обратно отправителю транзакции (владельцу)
    // Step 3: Transfer hero NFT to the sender of transaction (ctx.sender())
    transfer::transfer(hero, ctx.sender());

    // Шаг 4: создаем объект метаданных для героя
    // Step 4: Create metadata for tracking when the hero was created
    let metadata_id = object::new(ctx);
    let timestamp = ctx.epoch_timestamp_ms(); // Получаем время эпохи в миллисекундах
    let metadata = HeroMetadata {
        id: metadata_id,
        timestamp,
    };

    // Шаг 5: замораживаем метаданные, чтобы они были неизменяемыми
    // Step 5: Freeze metadata so it can’t be changed (immutable object)
    transfer::freeze_object(metadata);
}

// ========= ГЕТТЕРЫ (GETTERS) =========

/// Получить силу героя / Get hero power
public fun hero_power(hero: &Hero): u64 {
    hero.power
}

/// Получить имя героя / Get hero name (for testing)
#[test_only]
public fun hero_name(hero: &Hero): String {
    hero.name
}

/// Получить ссылку на изображение героя / Get hero image URL (for testing)
#[test_only]
public fun hero_image_url(hero: &Hero): String {
    hero.image_url
}

/// Получить ID героя / Get hero ID (for testing)
#[test_only]
public fun hero_id(hero: &Hero): ID {
    object::id(hero)
}
