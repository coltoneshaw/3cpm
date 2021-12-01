import { query, chooseDatabase } from "./database";
import log from 'electron-log';


function initializeBotsTable(db: any) {
    const stmt = db.prepare(`
        CREATE TABLE bots (
            id NUMBER PRIMARY KEY UNIQUE, 
            origin TEXT,
            account_id NUMBER,
            account_name TEXT,
            name TEXT,
            pairs TEXT,
            active_deals_count NUMBER,
            active_deals_usd_profit NUMBER,
            active_safety_orders_count NUMBER,
            base_order_volume NUMBER,
            base_order_volume_type TEXT,
            created_at TEXT,
            updated_at TEXT,
            enabled_active_funds NUMBER,
            enabled_inactive_funds NUMBER,
            finished_deals_count NUMBER,
            finished_deals_profit_usd NUMBER,
            from_currency TEXT,
            is_enabled BOOLEAN,
            martingale_coefficient NUMBER,
            martingale_volume_coefficient NUMBER,
            martingale_step_coefficient NUMBER,
            max_active_deals NUMBER,
            max_funds NUMBER,
            max_funds_per_deal NUMBER,
            max_inactive_funds NUMBER,
            max_safety_orders NUMBER,
            profit_currency TEXT,
            safety_order_step_percentage NUMBER,
            safety_order_volume NUMBER,
            safety_order_volume_type TEXT,
            stop_loss_percentage NUMBER,
            strategy TEXT,
            take_profit TEXT,
            take_profit_type TEXT,
            trailing_deviation NUMBER,
            type TEXT,
            price_deviation NUMBER,
            drawdown NUMBER,
            maxCoveragePercent NUMBER,
            maxSoReached NUMBER,
            hide BOOLEAN
            )`);

    stmt.run();

}

/**
 * TODO 
 * - Swap the  profitPercent table to be hourly_per_unit_profit_percent since this is divided by the hours.
 */
function initializeDealTable(db: any) {
    const stmt = db.prepare(`
        CREATE TABLE deals (
            id NUMBER PRIMARY KEY UNIQUE, 
            type TEXT, 
            bot_id NUMBER,
            max_safety_orders NUMBER,
            deal_has_error BOOLEAN,
            from_currency_id NUMBER,
            to_currency_id NUMBER,
            account_id NUMBER,
            active_safety_orders_count NUMBER,
            created_at TEXT,
            updated_at TEXT,
            closed_at TEXT,
            closed_at_iso_string NUMBER,
            finished BOOLEAN,
            current_active_safety_orders_count BOOLEAN,
            current_active_safety_orders NUMBER,
            completed_safety_orders_count NUMBER,
            completed_manual_safety_orders_count NUMBER,
            cancellable BOOLEAN,
            panic_sellable BOOLEAN,
            trailing_enabled BOOLEAN,
            tsl_enabled BOOLEAN,
            stop_loss_timeout_enabled BOOLEAN,
            stop_loss_timeout_in_seconds NUMBER,
            active_manual_safety_orders NUMBER,
            pair TEXT,
            status TEXT,
            localized_status TEXT,
            take_profit NUMBER,
            base_order_volume NUMBER,
            safety_order_volume NUMBER,
            safety_order_step_percentage NUMBER,
            leverage_type TEXT,
            leverage_custom_value NUMBER,
            bought_amount NUMBER,
            bought_volume NUMBER,
            bought_average_price NUMBER,
            base_order_average_price NUMBER,
            sold_amount NUMBER,
            sold_volume NUMBER,
            sold_average_price NUMBER,
            take_profit_type TEXT,
            final_profit NUMBER,
            martingale_coefficient NUMBER,
            martingale_volume_coefficient NUMBER,
            martingale_step_coefficient NUMBER,
            stop_loss_percentage NUMBER,
            error_message TEXT,
            profit_currency TEXT,
            stop_loss_type TEXT,
            safety_order_volume_type TEXT,
            base_order_volume_type TEXT,
            from_currency TEXT,
            to_currency TEXT,
            current_price NUMBER,
            take_profit_price NUMBER,
            stop_loss_price NUMBER,
            final_profit_percentage NUMBER,
            actual_profit_percentage NUMBER,
            bot_name TEXT,
            account_name TEXT,
            usd_final_profit NUMBER,
            actual_profit NUMBER,
            actual_usd_profit NUMBER,
            failed_message TEXT,
            reserved_base_coin NUMBER,
            reserved_second_coin NUMBER,
            trailing_deviation NUMBER,
            trailing_max_price NUMBER,
            tsl_max_price NUMBER,
            strategy TEXT,
            reserved_quote_funds TEXT,
            reserved_base_funds TEXT,
            realized_actual_profit_usd NUMBER,
            deal_hours NUMBER,
            currency TEXT,
            max_deal_funds NUMBER,
            profitPercent NUMBER,
            impactFactor NUMBER
            )`);

    stmt.run();

}

function initializeAccountTable(db: any) {
    const stmt = db.prepare(`
        CREATE TABLE accountData (
            id NUMBER PRIMARY KEY UNIQUE,
            account_id NUMBER,
            account_name TEXT,
            exchange_name TEXT,
            currency_code TEXT,
            percentage NUMBER,
            position NUMBER,
            on_orders NUMBER,
            btc_value NUMBER,
            usd_value NUMBER,
            market_code TEXT
            )`);

    stmt.run();

}

function initialDatabaseSetup(profileId: string) {
    const db = chooseDatabase(profileId);
    try {
        initializeDealTable(db);
        initializeAccountTable(db);
        initializeBotsTable(db);
        log.debug('Completed initial database setup.')
    } catch (err) {
        log.error('Unable to run the initial database setup', err)
    }

}

async function checkOrMakeTables(profileId: string) {

    // checking if the tables exist.
    const existingTables = await query(profileId, "SELECT name FROM sqlite_master WHERE type='table';")

    if (existingTables.length == 0) {
        await initialDatabaseSetup(profileId)
        return
    }

    const tableNames = existingTables.map(table => table.name)
    if (!tableNames.includes('deals')) await initializeDealTable(profileId)
    if (!tableNames.includes('accountData')) await initializeAccountTable(profileId)
    if (!tableNames.includes('bots')) await initializeBotsTable(profileId)
}

export {
    checkOrMakeTables
}
