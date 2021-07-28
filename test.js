const calc_deviation = (max_safety_orders, safety_order_step_percentage, martingale_step_coefficient) => {

    // setting the initial drawdown value.
    let drawdown = safety_order_step_percentage
    let prevDeviation = safety_order_step_percentage

    for (let so_count = 2; so_count <= max_safety_orders; so_count++) {
        let so_deviation = (prevDeviation * martingale_step_coefficient)
        drawdown += so_deviation
        prevDeviation = so_deviation
    }
    return drawdown.toFixed(2)
}


function calc_maxSOReached(moneyAvailable, max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient) {
    let maxTotal = base_order_volume + safety_order_volume
    let prevOrder = safety_order_volume
    let so_count = 2

    for (so_count; so_count <= max_safety_orders; so_count++){
        maxTotal += safety_order_volume * martingale_volume_coefficient ** (so_count - 1)

        if(maxTotal > moneyAvailable){
            return so_count - 1
        }
    }
    return so_count -1
}


const calc_dropCoverage = ( totalFundsAvailable, safety_order_step_percentage, martingale_step_coefficient, max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient ) => {
    /*
    take the total bankroll / total enabled bots = money available for this bot

    calculate how many SOs I can fill based on that money available for the bot
    use the # of SOs filled to calculate what deviation downward I can fill.

    return { calc_SO, calc_deviation, money_available.}

    bring the money_available into the tool tip on the calculated fields.
    */

    const maxSoReached = calc_maxSOReached(totalFundsAvailable, max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient)

    const deviation = calc_deviation(maxSoReached, safety_order_step_percentage, martingale_step_coefficient)
    console.log({deviation, maxSoReached})
}

calc_dropCoverage( 899.79, 2, 1.0, 30, 10, 20, 1.05 )