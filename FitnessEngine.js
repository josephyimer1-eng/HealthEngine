// ============================================================
// FITNESS & ANALYTICS
// ============================================================


// Get elements from the HTML
const calculateButton =
    document.getElementById("calculateButton");

const premiumButton =
    document.getElementById("premiumButton");


// ============================================================
// CALCULATE FITNESS STATISTICS
// ============================================================

calculateButton.addEventListener(
    "click",
    calculateFitness
);


function calculateFitness() {

    // -----------------------------------------
    // Get user inputs
    // -----------------------------------------

    const age =
        Number(document.getElementById("age").value);

    const sex =
        document.getElementById("sex").value;

    const height =
        Number(document.getElementById("height").value);

    const weight =
        Number(document.getElementById("weight").value);

    const activity =
        Number(document.getElementById("activity").value);

    const workouts =
        Number(document.getElementById("workouts").value);

    const goal =
        document.getElementById("goal").value;

    const targetWeight =
        Number(
            document.getElementById("targetWeight").value
        );


    const errorMessage =
        document.getElementById("errorMessage");


    // -----------------------------------------
    // Validate inputs
    // -----------------------------------------

    errorMessage.textContent = "";


    if (
        !age ||
        !sex ||
        !height ||
        !weight ||
        !activity ||
        !goal ||
        !targetWeight
    ) {

        errorMessage.textContent =
            "Please fill out all required fields.";

        return;
    }


    if (age < 13 || age > 100) {

        errorMessage.textContent =
            "Please enter a valid age.";

        return;
    }


    if (height < 36 || height > 100) {

        errorMessage.textContent =
            "Please enter a valid height.";

        return;
    }


    if (weight < 50 || weight > 700) {

        errorMessage.textContent =
            "Please enter a valid weight.";

        return;
    }


    // ========================================================
    // BMI
    // ========================================================

    // BMI = weight(lb) / height(in)^2 × 703

    const bmi =
        (weight / (height * height)) * 703;


    let bmiCategory;


    if (bmi < 18.5) {

        bmiCategory = "Underweight";

    } else if (bmi < 25) {

        bmiCategory = "Normal";

    } else if (bmi < 30) {

        bmiCategory = "Overweight";

    } else {

        bmiCategory = "Obese";
    }


    // ========================================================
    // BMR
    // ========================================================

    // Mifflin-St Jeor equation

    let bmr;


    if (sex === "male") {

        bmr =
            (10 * weight * 0.453592)
            +
            (6.25 * height * 2.54)
            -
            (5 * age)
            +
            5;

    } else {

        bmr =
            (10 * weight * 0.453592)
            +
            (6.25 * height * 2.54)
            -
            (5 * age)
            -
            161;
    }


    // ========================================================
    // MAINTENANCE CALORIES
    // ========================================================

    let maintenance =
        bmr * activity;


    // Round maintenance
    maintenance =
        Math.round(maintenance);


    // ========================================================
    // CALORIE TARGET
    // ========================================================

    let calorieTarget;

    let calorieDifference;


    if (goal === "lose") {

        calorieDifference = -500;

        calorieTarget =
            maintenance - 500;

    } else if (goal === "gain") {

        calorieDifference = 300;

        calorieTarget =
            maintenance + 300;

    } else {

        calorieDifference = 0;

        calorieTarget =
            maintenance;
    }


    // Don't allow absurdly low calculated targets
    if (calorieTarget < 1200) {

        calorieTarget = 1200;
    }


    calorieTarget =
        Math.round(calorieTarget);


    // ========================================================
    // WEIGHT DIFFERENCE
    // ========================================================

    const weightDifference =
        targetWeight - weight;


    // ========================================================
    // ESTIMATED WEEKLY CHANGE
    // ========================================================

    /*
        Approximation:

        3,500 calories ≈ 1 pound.

        This is only an estimate and real-world
        weight change is not perfectly linear.
    */

    const weeklyWeightChange =
        (Math.abs(calorieDifference) * 7) / 3500;


    // ========================================================
    // TIME TO GOAL
    // ========================================================

    let timeToGoal;


    if (Math.abs(weightDifference) < 0.1) {

        timeToGoal = "Already at target";

    } else if (
        goal === "lose" &&
        weightDifference < 0
    ) {

        const weeks =
            Math.abs(weightDifference)
            / weeklyWeightChange;

        timeToGoal =
            Math.ceil(weeks) + " weeks";

    } else if (
        goal === "gain" &&
        weightDifference > 0
    ) {

        const weeks =
            Math.abs(weightDifference)
            / weeklyWeightChange;

        timeToGoal =
            Math.ceil(weeks) + " weeks";

    } else {

        timeToGoal =
            "Target does not match selected goal";
    }


    // ========================================================
    // UPDATE DASHBOARD
    // ========================================================

    document.getElementById("bmiValue")
        .textContent =
        bmi.toFixed(1);


    document.getElementById("bmiCategory")
        .textContent =
        bmiCategory;


    document.getElementById("bmrValue")
        .textContent =
        Math.round(bmr).toLocaleString();


    document.getElementById("maintenanceValue")
        .textContent =
        maintenance.toLocaleString();


    document.getElementById("calorieTarget")
        .textContent =
        calorieTarget.toLocaleString();


    document.getElementById("currentWeightResult")
        .textContent =
        weight.toFixed(1) + " lbs";


    document.getElementById("targetWeightResult")
        .textContent =
        targetWeight.toFixed(1) + " lbs";


    let differenceText;


    if (weightDifference > 0) {

        differenceText =
            "+" +
            weightDifference.toFixed(1) +
            " lbs";

    } else {

        differenceText =
            weightDifference.toFixed(1) +
            " lbs";
    }


    document.getElementById("weightDifference")
        .textContent =
        differenceText;


    // -----------------------------------------
    // Calorie difference
    // -----------------------------------------

    let calorieText;


    if (calorieDifference > 0) {

        calorieText =
            "+" +
            calorieDifference +
            " calories/day";

    } else if (calorieDifference < 0) {

        calorieText =
            calorieDifference +
            " calories/day";

    } else {

        calorieText =
            "0 calories/day";
    }


    document.getElementById("calorieDifference")
        .textContent =
        calorieText;


    // -----------------------------------------
    // Weekly change
    // -----------------------------------------

    let weeklyText;


    if (goal === "lose") {

        weeklyText =
            "-" +
            weeklyWeightChange.toFixed(2) +
            " lbs/week";

    } else if (goal === "gain") {

        weeklyText =
            "+" +
            weeklyWeightChange.toFixed(2) +
            " lbs/week";

    } else {

        weeklyText =
            "Approximately 0 lbs/week";
    }


    document.getElementById("weeklyChange")
        .textContent =
        weeklyText;


    document.getElementById("timeToGoal")
        .textContent =
        timeToGoal;


    // ========================================================
    // GOAL MESSAGE
    // ========================================================

    const goalMessage =
        document.getElementById("goalMessage");


    if (goal === "lose") {

        goalMessage.innerHTML = `
            <strong>Weight Loss Plan</strong><br><br>

            Your estimated maintenance intake is
            <strong>${maintenance.toLocaleString()}
            calories/day</strong>.

            A starting target of approximately
            <strong>${calorieTarget.toLocaleString()}
            calories/day</strong> creates an estimated
            500-calorie daily deficit.

            Your estimated rate of weight loss is
            approximately
            <strong>${weeklyWeightChange.toFixed(2)}
            lbs/week</strong>.

            Actual results will vary because metabolism,
            activity, water weight, and body composition
            change over time.
        `;

    } else if (goal === "gain") {

        goalMessage.innerHTML = `
            <strong>Weight Gain Plan</strong><br><br>

            Your estimated maintenance intake is
            <strong>${maintenance.toLocaleString()}
            calories/day</strong>.

            A starting target of approximately
            <strong>${calorieTarget.toLocaleString()}
            calories/day</strong> creates an estimated
            300-calorie daily surplus.

            Your estimated rate of weight gain is
            approximately
            <strong>${weeklyWeightChange.toFixed(2)}
            lbs/week</strong>.

            Combining adequate protein with resistance
            training can help maximize the proportion
            of weight gained as muscle.
        `;

    } else {

        goalMessage.innerHTML = `
            <strong>Weight Maintenance Plan</strong><br><br>

            Your estimated maintenance intake is
            approximately
            <strong>${maintenance.toLocaleString()}
            calories/day</strong>.

            Eating around this amount should theoretically
            maintain your current weight, although actual
            maintenance needs vary between individuals.
        `;
    }


    // ========================================================
    // SHOW DASHBOARD
    // ========================================================

    document
        .getElementById("dashboard")
        .classList.remove("hidden");


    // Scroll to dashboard
    document
        .getElementById("dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });
}



// ============================================================
// STRIPE $5 ONE-TIME PURCHASE
// ============================================================

premiumButton.addEventListener(
    "click",
    startPremiumCheckout
);


async function startPremiumCheckout() {

    const paymentStatus =
        document.getElementById("paymentStatus");


    premiumButton.disabled = true;

    paymentStatus.textContent =
        "Opening secure Stripe checkout...";


    try {

        /*
            IMPORTANT:

            Your Stripe secret key NEVER goes here.

            This request goes to your backend.
            Your backend creates the Stripe Checkout Session.
        */

        const response =
            await fetch(
                "http://localhost:3000/create-checkout-session",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Checkout could not be created."
            );
        }


        // Send customer to Stripe
        window.location.href =
            data.url;


    } catch (error) {

        console.error(error);


        paymentStatus.textContent =
            "Unable to open Stripe checkout. " +
            "Make sure your backend is running.";


        premiumButton.disabled = false;
    }
}
