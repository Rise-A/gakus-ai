import * as SQLite from 'expo-sqlite';

async function setupDatabase() {
  const db = await SQLite.openDatabaseAsync('gakusai_db.db');

  // ## Table Creation
  /////////////////////////

  // # User Table
  createUserTable(db);

  /////////////////////////

  // # Notecard Tables

  createNotecardCategoryTable(db);

  createNotecardFormalityTable(db);

  // Creates Notecard Table
  createNotecardTable(db);

  createNotecardScriptTable(db);

  createNotecardScriptJunctionTable(db);

  /////////////////////////

  // await db.execAsync('DROP TABLE IF EXISTS Notecard');
  // await db.execAsync('DROP TABLE IF EXISTS Furigana');

  // print tables
  // const tables = await db.getAllAsync("SELECT * FROM sqlite_master WHERE type='table'");
  // console.log('DB contents:', tables);

  return db;
}

// ## Table Creation
///////////////////////////////////////////////////////////////////////

// # User Table
///////////////////////////////////////////////////////////////////////

async function createUserTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS User (
      userID            INTEGER         PRIMARY KEY AUTOINCREMENT,
      username          TEXT            NOT NULL,
      apiKey            TEXT            
    );
    `
  );
}

/////////////////////////////////////////////////////////////////////

// # Notecard Tables
/////////////////////////////////////////////////////////////////////


async function createNotecardCategoryTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS NotecardCategory (
      categoryID          INTEGER         PRIMARY KEY AUTOINCREMENT,
      categoryName        TEXT            NOT NULL          
    );
    `
  );
}

async function createNotecardFormalityTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS NotecardFormality (
      formalityID         INTEGER         PRIMARY KEY AUTOINCREMENT,
      formalityName       TEXT            NOT NULL          
    );
    `
  );
}

// Notecard - Category: Many - One
// Notecard - Script: Many - Many
// Notecard - Formality: Many - One (Can be NULL, since it's not applicable to kana)
async function createNotecardTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS Notecard (
      notecardID        INTEGER         PRIMARY KEY AUTOINCREMENT,
      categoryID        INTEGER         ,
      formalityID       INTEGER         ,
      englishText       TEXT            ,
      romajiText        TEXT            NOT NULL,
      japaneseText      JSONB           NOT NULL,
      FOREIGN KEY (categoryID)          REFERENCES NotecardCategory(categoryID),
      FOREIGN KEY (formalityID)         REFERENCES NotecardFormality(formalityID)
    );
    `
    // japaneseText: rawText, rubyText (id, furigana, kanji)
    // Scripts: Hiragana, Katakana, Kanji, Mixed
    // Categories: Kana/Character, Kotoba/Word, Sentence
    
  );
}

async function createNotecardScriptTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS NotecardScript (
      scriptID          INTEGER        PRIMARY KEY AUTOINCREMENT,
      scriptName        TEXT           NOT NULL
    );
    `
  );
}

// Since Notecard, and Notecard Script have a many-many relationship, an additional junction/join table is needed for both
async function createNotecardScriptJunctionTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `
    CREATE TABLE IF NOT EXISTS NotecardScriptJunction (
      notecardID         INTEGER         NOT NULL,
      scriptID           INTEGER         NOT NULL,
      PRIMARY KEY (notecardID, scriptID),
      FOREIGN KEY (notecardID)           REFERENCES Notecard(notecardID),
      FOREIGN KEY (scriptID)             REFERENCES NotecardScript(scriptID)
    );
    `
  );
}

///////////////////////////////////////////////////////////////////////////

// ## Initial Rows / Tuples (ie, kana)
///////////////////////////////////////////////////////////////////////

// Example of ruby in HTML (word: Kan ji):
// <ruby>
//   漢 <rp>(</rp><rt>Kan</rt><rp>)</rp> 字 <rp>(</rp><rt>ji</rt><rp>)</rp>
// </ruby>

export default setupDatabase;

 // To run, open project in terminal, then run: npx expo start