"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const $ = (id) => document.getElementById(id);

    const calculateButton = $("calculateButton");
    const dashboard = $("dashboard");
    const errorMessage = $("errorMessage");
    const premiumButton = $("premiumButton");

    // Make sure the HTML elements exist.
    if (!calculateButton || !dashboard || !errorMessage) {
        console.error(
            "Calculator elements not found. Check index.html and script.js."
        );
        return;
    }

    function showError(message) {
        errorMessage.textContent = message;
        dashboard.classList.add("hidden");
    }

    function show(id, value) {
        const element = $(id);
        if (element) element.textContent = value;
    }

    function number(value) {
        return Math.round(value).toLocaleString("en-US");
    }

    function weightText(value) {
        return Number(value).toFixed(1) + " lbs";
    }

    function calculateFitness() {
        errorMessage.textContent = "";

        const age = Number($("age").value);
        const sex = $("sex").value;
        const height = Number($("height").value);
        const weight = Number($("weight").value);
        const activity = Number($("activity").value);
        const workouts = Number($("workouts").value);
        const goal = $("goal").value;

        const targetInput = $("targetWeight").value.trim();
        const targetWeight = targetInput === ""
            ? null
            : Number(targetInput);

        // Validate inputs.
        if (!Number.isFinite(age) || age < 13 || age > 100) {
            showError("Enter an age between 13 and 100.");
            return;
        }

        if (sex !== "male" && sex !== "female") {
            showError("Please select your sex.");
            return;
        }

        if (!Number.isFinite(height) || height < 36 || height > 100) {
            showError("Enter a height between 36 and 100 inches.");
            return;
        }

        if (!Number.isFinite(weight) || weight < 50 || weight > 700) {
            showError("Enter a weight between 50 and 700 lbs.");
            return;
        }

        if (![1.2, 1.375, 1.55, 1.725, 1.9].includes(activity)) {
            showError("Please select an activity level.");
            return;
        }

        if (!Number.isInteger(workouts) || workouts < 1 || workouts > 7) {
            showError("Select between 1 and 7 workouts per week.");
            return;
        }

        if (!["lose", "maintain", "gain"].includes(goal)) {
            showError("Please select a fitness goal.");
            return;
        }

        // Target weight is optional for maintenance.
        if (goal !== "maintain" && targetWeight === null) {
            showError("Enter a target weight for your selected goal.");
            return;
        }

        if (
            targetWeight !== null &&
            (!Number.isFinite(targetWeight) ||
             targetWeight < 50 ||
             targetWeight > 700)
        ) {
            showError("Enter a target weight between 50 and 700 lbs.");
            return;
        }

        if (
            goal === "lose" &&
            targetWeight !== null &&
            targetWeight >= weight
        ) {
            showError("Your weight-loss target must be below your current weight.");
            return;
        }

        if (
            goal === "gain" &&
            targetWeight !== null &&
            targetWeight <= weight
        ) {
            showError("Your weight-gain target must be above your current weight.");
            return;
        }

        // BMI.
        const bmi = (weight / (height * height)) * 703;

        let bmiCategory;

        if (age < 20) {
            bmiCategory = "Use age-specific BMI percentiles";
        } else if (bmi < 18.5) {
            bmiCategory = "Underweight";
        } else if (bmi < 25) {
            bmiCategory = "Normal weight";
        } else if (bmi < 30) {
            bmiCategory = "Overweight";
        } else {
            bmiCategory = "Obesity range";
        }

        // BMR: Mifflin-St Jeor estimate.
        const weightKg = weight * 0.45359237;
        const heightCm = height * 2.54;

        const bmrBase =
            10 * weightKg +
            6.25 * heightCm -
            5 * age;

        const bmr = sex === "male"
            ? bmrBase + 5
            : bmrBase - 161;

        // Estimated maintenance calories.
        const maintenance = Math.round(bmr * activity);

        // Calorie targets are rough estimates for adults.
        // Do not automatically prescribe adult deficits
        // or surpluses to users under 18.
        let calorieTarget = maintenance;

        if (age >= 18) {
            if (goal === "lose") {
                calorieTarget = maintenance - 300;
            } else if (goal === "gain") {
                calorieTarget = maintenance + 200;
            }
        }

        calorieTarget = Math.round(calorieTarget);

        const calorieDifference = calorieTarget - maintenance;

        // Approximate energy-balance projection.
        const weeklyChange = calorieDifference * 7 / 3500;

        // For maintenance, use the current weight.
        const actualTarget = targetWeight === null
            ? weight
            : targetWeight;

        const weightDifference = actualTarget - weight;

        // Display the four main statistics.
        show("bmiValue", bmi.toFixed(1));
        show("bmiCategory", bmiCategory);
        show("bmrValue", number(bmr));
        show("maintenanceValue", number(maintenance));
        show("calorieTarget", number(calorieTarget));

        // Display detailed results.
        show("currentWeightResult", weightText(weight));

        show(
            "targetWeightResult",
            targetWeight === null
                ? "No target needed"
                : weightText(targetWeight)
        );

        let differenceText = "No change";

        if (weightDifference > 0.05) {
            differenceText = "+" + weightText(weightDifference);
        } else if (weightDifference < -0.05) {
            differenceText = "-" + weightText(Math.abs(weightDifference));
        }

        show("weightDifference", differenceText);

        let calorieText;

        if (calorieDifference > 0) {
            calorieText = "+" + number(calorieDifference) + " calories/day";
        } else if (calorieDifference < 0) {
            calorieText = "-" + number(Math.abs(calorieDifference)) + " calories/day";
        } else {
            calorieText = "0 calories/day";
        }

        show("calorieDifference", calorieText);

        let weeklyText = "Approximately 0 lbs/week";

        if (weeklyChange > 0.01) {
            weeklyText = "Gain approximately " +
                weeklyChange.toFixed(2) + " lbs/week";
        } else if (weeklyChange < -0.01) {
            weeklyText = "Lose approximately " +
                Math.abs(weeklyChange).toFixed(2) + " lbs/week";
        }

        show("weeklyChange", weeklyText);

        // Estimate time to goal only if the direction matches.
        let timeToGoal;

        if (goal === "maintain") {
            timeToGoal = "Maintenance goal";
        } else if (
            (goal === "lose" && weeklyChange >= 0) ||
            (goal === "gain" && weeklyChange <= 0)
        ) {
            timeToGoal = "No estimated progress toward goal";
        } else {
            const weeks = Math.abs(weightDifference / weeklyChange);

            if (Math.abs(weightDifference) < 0.05) {
                timeToGoal = "Already at target";
            } else if (!Number.isFinite(weeks)) {
                timeToGoal = "Unable to estimate";
            } else if (weeks < 1) {
                timeToGoal = "Less than 1 week";
            } else if (weeks < 4.345) {
                timeToGoal = Math.ceil(weeks) + " weeks";
            } else if (weeks / 4.345 < 12) {
                timeToGoal = (weeks / 4.345).toFixed(1) + " months";
            } else {
                timeToGoal = (weeks / 52.14).toFixed(1) + " years";
            }
        }

        show("timeToGoal", timeToGoal);

        // Personalized goal analysis.
        let analysis;

        if (age < 18) {
            analysis =
                "Because your body may still be growing, adult calorie " +
                "equations and weight targets may not be appropriate. " +
                "Treat these results as estimates and seek personalized " +
                "nutrition guidance from a qualified healthcare professional.";
        } else if (goal === "lose") {
            analysis =
                "Your goal is weight loss. Estimated maintenance is " +
                number(maintenance) + " calories/day. Your estimated " +
                "target is " + number(calorieTarget) +
                " calories/day. Actual results vary with activity, metabolism, " +
                "water weight, and other factors.";
        } else if (goal === "gain") {
            analysis =
                "Your goal is weight gain. Estimated maintenance is " +
                number(maintenance) + " calories/day. Your estimated " +
                "target is " + number(calorieTarget) +
                " calories/day. Strength training and adequate nutrition " +
                "can support muscle development.";
        } else {
            analysis =
                "Your goal is maintaining your weight. Estimated maintenance " +
                "is " + number(maintenance) +
                " calories/day. Monitor your weight trend to see whether " +
                "this estimate matches your actual needs.";
        }

        analysis += " You selected " + workouts +
            " workout(s) per week. Activity level is used to estimate " +
            "energy needs; workout count is not added separately.";

        // Use textContent instead of innerHTML.
        show("goalMessage", analysis);

        // Show the dashboard.
        dashboard.classList.remove("hidden");

        dashboard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // Connect the button.
    calculateButton.addEventListener("click", calculateFitness);

    // Premium payment is not configured.
    if (premiumButton) {
        premiumButton.addEventListener("click", function () {
            show(
                "paymentStatus",
                "Premium payments are not configured yet."
            );
        });
    }

    dashboard.classList.add("hidden");
});
