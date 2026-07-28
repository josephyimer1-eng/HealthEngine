function generatePlan(){


let age =
Number(document.getElementById("age").value);


let height =
Number(document.getElementById("height").value);


let weight =
Number(document.getElementById("weight").value);


let goal =
document.getElementById("goal").value;


let days =
Number(document.getElementById("days").value);


let change =
Number(document.getElementById("change").value);




if(!age || !height || !weight || !days){

document.getElementById("result").innerHTML=

`
<h2>Error</h2>

<p>Please enter all information.</p>

`;

return;

}





// CONVERSION


let heightMeters =
height * 0.0254;


let heightCm =
height * 2.54;


let weightKg =
weight * 0.453592;






// BMI


let bmi =
weightKg /
(heightMeters * heightMeters);



let bmiCategory;



if(bmi < 18.5){

bmiCategory="Underweight";

}

else if(bmi < 25){

bmiCategory="Normal";

}

else if(bmi < 30){

bmiCategory="Overweight";

}

else{

bmiCategory="Obese";

}





// CALORIES


let bmr =

10 * weightKg

+

6.25 * heightCm

-

5 * age

+

5;



let activity;



if(days<=2){

activity=1.2;

}

else if(days<=4){

activity=1.45;

}

else if(days<=6){

activity=1.6;

}

else{

activity=1.75;

}




let maintenance =
bmr * activity;



let calories;



if(goal==="lose"){

calories =
maintenance-500;

}

else if(goal==="muscle"){

calories =
maintenance+300;

}

else{

calories =
maintenance;

}





// PROTEIN


let protein =
weightKg*2.2;





// TARGET WEIGHT


let targetWeight;


if(goal==="lose"){

targetWeight =
weight-change;

}

else if(goal==="muscle"){

targetWeight =
weight+change;

}

else{

targetWeight =
weight;

}





// TIME PREDICTION


let weeklyChange;


if(goal==="lose"){

weeklyChange=1;

}

else if(goal==="muscle"){

weeklyChange=.5;

}

else{

weeklyChange=0;

}



let weeks;


if(weeklyChange){

weeks =
Math.abs(change/weeklyChange);

}

else{

weeks=0;

}





// ============================
// ADVANCED STATISTICS
// ============================


// Logistic regression model


let bmiScore;


if(bmi<25){

bmiScore=1;

}

else if(bmi<30){

bmiScore=.5;

}

else{

bmiScore=0;

}




let z =

-1

+

(days*.35)

+

(protein*.01)

+

(bmiScore*.8);



let probability =

1/(1+Math.exp(-z));



let success =

Math.round(probability*100);



success=Math.max(success,25);

success=Math.min(success,95);






// Body composition estimate


let bodyFat;



if(bmi<25){

bodyFat =
15+(bmi-22)*2;

}

else if(bmi<30){

bodyFat =
20+(bmi-25)*2.5;

}

else{

bodyFat =
25+(bmi-30)*1.5;

}



bodyFat =
Math.max(8,Math.min(45,bodyFat));



let fatMass =
weight*(bodyFat/100);



let leanMass =
weight-fatMass;







// Weekly weight change


let calorieDifference =
maintenance-calories;



let weeklyLoss =
(calorieDifference*7)/3500;







// Confidence interval


let lowerWeeks =
weeks*.85;


let upperWeeks =
weeks*1.20;






// Efficiency score


let efficiency;



if(goal==="lose"){


if(calorieDifference>=300 &&
calorieDifference<=700){

efficiency="Excellent";

}

else if(calorieDifference>700){

efficiency="Aggressive";

}

else{

efficiency="Slow";

}


}

else{

efficiency="Not applicable";

}





// Plateau prediction


let plateauRisk;



if(goal==="lose" && bmi<25){

plateauRisk="Moderate";

}

else{

plateauRisk="Low";

}







// Fitness score


let fitnessScore =

(days*8)

+

(protein/10)

+

(bmiScore*20);




let zScore =

((fitnessScore-60)/15).toFixed(2);





let tScore =

((fitnessScore-50)/15).toFixed(2);







// WORKOUT


let workout;



if(days<=3){


workout=

"Full Body: Squats, Bench Press, Rows, Shoulder Press";


}

else if(days<=5){


workout=

"Upper/Lower Split: Upper days + Lower days";


}

else{


workout=

"Push Pull Legs: Push, Pull, Legs split";

}








// DISPLAY



document.getElementById("result").innerHTML=


`

<h2>AI Fitness Report</h2>



<h3>Body Analysis</h3>


<p>
BMI: ${bmi.toFixed(1)}
</p>


<p>
BMI Category: ${bmiCategory}
</p>



<h3>Nutrition</h3>


<p>
Daily Calories:
${Math.round(calories)} calories
</p>


<p>
Protein:
${Math.round(protein)} grams/day
</p>




<h3>Goal Prediction</h3>


<p>
Current Weight:
${weight} lbs
</p>


<p>
Target Weight:
${targetWeight} lbs
</p>


<p>
Estimated Time:
${weeks.toFixed(0)} weeks
</p>


<p>
Confidence Range:
${lowerWeeks.toFixed(0)}
-
${upperWeeks.toFixed(0)}
weeks
</p>




<h3>Advanced Statistics</h3>


<p>
Goal Success Probability:
${success}%
</p>


<p>
Fitness Progress Score:
${Math.round(fitnessScore)}/100
</p>


<p>
Fitness Z-score:
${zScore}
</p>


<p>
Fitness T-score:
${tScore}
</p>


<p>
Estimated Body Fat:
${bodyFat.toFixed(1)}%
</p>


<p>
Estimated Lean Mass:
${leanMass.toFixed(1)} lbs
</p>


<p>
Estimated Fat Mass:
${fatMass.toFixed(1)} lbs
</p>


<p>
Weekly Weight Change:
${weeklyLoss.toFixed(2)} lbs/week
</p>


<p>
Fat Loss Efficiency:
${efficiency}
</p>


<p>
Plateau Risk:
${plateauRisk}
</p>




<h3>Workout Recommendation</h3>


<p>
${workout}
</p>


`;



}