CREATE TABLE IF NOT EXISTS translation_dictionary (
    id SERIAL PRIMARY KEY,
    source_lang VARCHAR(10) NOT NULL,
    target_lang VARCHAR(10) NOT NULL,
    source_phrase TEXT NOT NULL,
    target_phrase TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS slang_dictionary (
    id SERIAL PRIMARY KEY,
    lang VARCHAR(10) NOT NULL,
    slang_term TEXT NOT NULL,
    formal_meaning TEXT NOT NULL,
    equivalent TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS translation_corrections (
    id SERIAL PRIMARY KEY,
    source_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    source_lang VARCHAR(10) NOT NULL,
    target_lang VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translation_history (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_lang VARCHAR(10) NOT NULL,
    target_lang VARCHAR(10) NOT NULL,
    style VARCHAR(50) DEFAULT 'natural',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    default_style VARCHAR(50) DEFAULT 'natural',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
