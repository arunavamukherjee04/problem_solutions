function findBestBeer(total_beer_taps) {
    
    /**
     * number (id) of the tap to be checked. 
     * @param {number} _tap 
     */
    function isBestBeerTap(_tap) {
        let sum = 1; // Because 1 is always a divisor 
        const divisors = [1]; // Because 1 is always a divisor
        for (let _tap_index = 2; _tap_index <= _tap / 2; _tap_index++) {
            if (_tap % _tap_index === 0 && !divisors.includes(_tap_index)) {
                divisors.push(_tap_index);
                sum += _tap_index;
            }
        }
        const memo = new Array(divisors.length).fill(new Array(_tap + 1));
        if (sum > _tap && !isSubsetSum(divisors, divisors.length, _tap, memo)) {
                return true
        }

        return false;
    }
    
    /**
     * Checking if subset sum is more than tap number or not.
     * @param {array} set 
     * @param {number} len 
     * @param {number} rem
     * @param {array} memo 
     */
    function isSubsetSum(set, len, rem, memo) {
        if (rem === 0) return true;
        if (len === 0 && rem !== 0) return false;

        if (memo[len - 1][rem]) return memo[len][rem];

        const start = set.length - len;

        /** 
         * If remaining sum is less than the current tap, don't include it in the sub array. 
        */
        if (rem < set[start]) return isSubsetSum(set, len - 1, rem, memo);

        /** 
         * Subset with including the tap or without including the tap.
        */
        if (!memo[len - 1][rem]) memo[len - 1][rem] = isSubsetSum(set, len - 1, rem, memo) || isSubsetSum(set, len - 1, rem - set[start], memo);

        return memo[len - 1][rem];
    }

    
    const best_beer_taps = [];
    for (let tap = 1; tap <= total_beer_taps; tap++) {
        if (isBestBeerTap(tap)) {
            best_beer_taps.push(tap);
        }
    }

    return best_beer_taps;
}

console.log(findBestBeer(1000));




