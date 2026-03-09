/* ACCOUNT STORAGE HELPERS */

function getUsers(){
var users = JSON.parse(localStorage.getItem("fitworldUsers") || "[]");
if(!Array.isArray(users)){
return [];
}
return users;
}

function saveUsers(users){
localStorage.setItem("fitworldUsers", JSON.stringify(users));
}

function getCurrentUserCode(){
return localStorage.getItem("fitworldCurrentUserCode") || "";
}

function setCurrentUserCode(code){
localStorage.setItem("fitworldCurrentUserCode", code);
localStorage.setItem("fitworldLastLoginCode", code);
}

function getUserDataKey(baseKey, code){
return baseKey + "_" + code;
}

function migrateLegacyAccount(){
var users = getUsers();
if(users.length > 0){
return;
}

var legacyUsername = localStorage.getItem("fitworldUsername");
var legacyPassword = localStorage.getItem("fitworldPassword");
var legacyCode = localStorage.getItem("fitworldCode");

if(legacyUsername && legacyPassword && legacyCode){
users.push({
username: legacyUsername,
password: legacyPassword,
code: legacyCode
});
saveUsers(users);

var legacyBmi = localStorage.getItem("fitworldBMIValue");
var legacyCategory = localStorage.getItem("fitworldBMICategory");
var legacyPlan = localStorage.getItem("fitworldWeeklyPlan");
if(legacyBmi){
localStorage.setItem(getUserDataKey("fitworldBMIValue", legacyCode), legacyBmi);
}
if(legacyCategory){
localStorage.setItem(getUserDataKey("fitworldBMICategory", legacyCode), legacyCategory);
}
if(legacyPlan){
localStorage.setItem(getUserDataKey("fitworldWeeklyPlan", legacyCode), legacyPlan);
}
}
}

/* LOGIN FUNCTION */

function loginUser(event){

event.preventDefault();

migrateLegacyAccount();

var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
var loginCode = document.getElementById("loginCode").value;
var users = getUsers();

if(username === "" || password === "" || loginCode === ""){

alert("Please enter username, password, and unique code");
return;

}

if(!users.length){

alert("No account found. Please register first.");
return;

}

var matchedUser = null;
for(let i = 0; i < users.length; i++){
if(users[i].username === username && users[i].password === password && users[i].code === loginCode){
matchedUser = users[i];
break;
}
}

if(matchedUser){

setCurrentUserCode(matchedUser.code);
alert("Login Successful!");
var params = new URLSearchParams(window.location.search);
if(params.get("next") === "tracker"){
window.location.href="tracking.html";
}else{
window.location.href="dashboard.html";
}

}else{

alert("Invalid username, password, or unique code");

}

}

/* REGISTER FUNCTION */

function generateUniqueCode(){
var rawCount = localStorage.getItem("fitworldCodeCounter");
var currentCount = parseInt(rawCount || "0", 10);
if(!Number.isFinite(currentCount) || currentCount < 0){
currentCount = 0;
}
var nextCount = currentCount + 1;
localStorage.setItem("fitworldCodeCounter", String(nextCount));
return "HM" + String(nextCount).padStart(3, "0");
}

function registerUser(event){

event.preventDefault();

migrateLegacyAccount();

var username = document.getElementById("registerUsername").value;
var password = document.getElementById("registerPassword").value;
var backToLoginBtn = document.getElementById("backToLoginBtn");
var generatedCodeBox = document.getElementById("generatedCodeBox");
var generatedCodeValue = document.getElementById("generatedCodeValue");

if(username === "" || password === ""){

alert("Please enter username and password");
return;

}

var users = getUsers();
for(let i = 0; i < users.length; i++){
if(users[i].username === username){
alert("Username already exists. Please choose another username.");
return;
}
}

var uniqueCode = generateUniqueCode();

users.push({
username: username,
password: password,
code: uniqueCode
});
saveUsers(users);

localStorage.setItem("fitworldLastLoginCode", uniqueCode);

alert("Registration successful! Your unique code is: " + uniqueCode);

if(generatedCodeBox && generatedCodeValue){
generatedCodeBox.style.display = "block";
generatedCodeValue.innerText = uniqueCode;
}

if(backToLoginBtn){
backToLoginBtn.style.display = "inline-block";
}

setTimeout(function(){
window.location.href = "login.html";
}, 800);

}

document.addEventListener("DOMContentLoaded", function(){
migrateLegacyAccount();

var loginCodeInput = document.getElementById("loginCode");
if(loginCodeInput){
var savedCode = localStorage.getItem("fitworldLastLoginCode") || localStorage.getItem("fitworldCode");
if(savedCode && /^HM\d{3,}$/.test(savedCode)){
loginCodeInput.value = savedCode;
}
}

loadDashboardData();
loadTrackingPageData();
});

function getCalorieTargets(category){
if(category === "Underweight"){
return [2800, 2850, 2900, 2800, 2900, 2750, 2700];
}
if(category === "Normal Weight"){
return [2200, 2200, 2250, 2200, 2250, 2150, 2100];
}
if(category === "Overweight"){
return [1800, 1750, 1800, 1750, 1800, 1700, 1650];
}
return [1600, 1550, 1600, 1550, 1600, 1500, 1450];
}

function getTodayIsoDate(){
var today = new Date();
var month = String(today.getMonth() + 1).padStart(2, "0");
var day = String(today.getDate()).padStart(2, "0");
return today.getFullYear() + "-" + month + "-" + day;
}

function formatIsoDate(isoDate){
var parts = isoDate.split("-");
return parts[2] + "-" + parts[1] + "-" + parts[0];
}

function buildMonthlyPlan(weeklyPlan, category){
var calories = getCalorieTargets(category);
var weeklyByDay = {};
for(let i = 0; i < weeklyPlan.length; i++){
weeklyByDay[weeklyPlan[i].day] = {
workout: weeklyPlan[i].workout,
diet: weeklyPlan[i].diet,
calories: calories[i]
};
}

var now = new Date();
var year = now.getFullYear();
var month = now.getMonth();
var daysInMonth = new Date(year, month + 1, 0).getDate();
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var monthlyPlan = [];

for(let day = 1; day <= daysInMonth; day++){
var dateObj = new Date(year, month, day);
var dayName = dayNames[dateObj.getDay()];
var isoDate = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
var daily = weeklyByDay[dayName] || { workout: "Rest", diet: "Balanced meals", calories: 2000 };
monthlyPlan.push({
date: isoDate,
dayName: dayName,
workout: daily.workout,
diet: daily.diet,
calories: daily.calories
});
}

return monthlyPlan;
}

function renderWeeklySchedule(weeklyPlan){
var scheduleElement = document.getElementById("schedule");
if(!scheduleElement){
return;
}

let rows = "";
for(let i = 0; i < weeklyPlan.length; i++){
rows += "<tr><td>" + weeklyPlan[i].day + "</td><td>" + weeklyPlan[i].workout + "</td><td>" + weeklyPlan[i].diet + "</td></tr>";
}

scheduleElement.innerHTML =
"<h3>Weekly Schedule + Daily Diet Plan</h3>" +
"<div class='plan-table-wrap'>" +
"<table class='plan-table'>" +
"<thead><tr><th>Day</th><th>Workout Schedule</th><th>Diet Plan</th></tr></thead>" +
"<tbody>" + rows + "</tbody>" +
"</table>" +
"</div>";
}

function renderProgressTracker(weeklyPlan, category){
var trackerSection = document.getElementById("trackerSection");
var progressTable = document.getElementById("progressTable");
if(!trackerSection || !progressTable){
return;
}

var currentUserCode = getCurrentUserCode();
if(!currentUserCode){
return;
}

var monthlyPlan = buildMonthlyPlan(weeklyPlan, category);
var progressKey = getUserDataKey("fitworldProgressMonthly", currentUserCode);
var weightKey = getUserDataKey("fitworldDailyWeight", currentUserCode);
var savedProgress = JSON.parse(localStorage.getItem(progressKey) || "{}");
var savedDailyWeight = JSON.parse(localStorage.getItem(weightKey) || "{}");
var todayIso = getTodayIsoDate();
let rows = "";

for(let i = 0; i < monthlyPlan.length; i++){
var item = monthlyPlan[i];
var checked = savedProgress[item.date] ? "checked" : "";
var isMissed = item.date < todayIso && !savedProgress[item.date];
var isToday = item.date === todayIso;
var lockByDate = isToday ? "" : "disabled";
var savedWeightValue = savedDailyWeight[item.date] || "";
var rowClass = isMissed ? "class='missed-row'" : "";
rows += "<tr " + rowClass + "><td>" + formatIsoDate(item.date) + "</td><td>" + item.dayName + "</td><td>" + item.workout + "</td><td>" + item.calories + " kcal</td><td><input type='checkbox' class='progress-check' data-date='" + item.date + "' " + checked + " " + lockByDate + "></td><td><input type='number' step='0.1' min='1' class='weight-input' data-date='" + item.date + "' value='" + savedWeightValue + "' " + lockByDate + "></td></tr>";
}

progressTable.innerHTML =
"<h4>Monthly Progress Tracker</h4>" +
"<div class='plan-table-wrap'>" +
"<table class='plan-table'>" +
"<thead><tr><th>Date</th><th>Day</th><th>Schedule</th><th>Expected Calories</th><th>Done?</th><th>Your Weight (kg)</th></tr></thead>" +
"<tbody>" + rows + "</tbody>" +
"</table>" +
"</div>";

trackerSection.style.display = "block";
checkProgressNotification(true);
renderMonthSummary();
bindTrackingAutoSave();
}

function saveProgress(){
saveProgressInternal(true);
}

function saveProgressInternal(showAlert){
var checks = document.querySelectorAll(".progress-check");
if(!checks.length){
return;
}

var currentUserCode = getCurrentUserCode();
if(!currentUserCode){
alert("Please login first.");
return;
}

var progress = {};
for(let i = 0; i < checks.length; i++){
progress[checks[i].getAttribute("data-date")] = checks[i].checked;
}
localStorage.setItem(getUserDataKey("fitworldProgressMonthly", currentUserCode), JSON.stringify(progress));

var weightInputs = document.querySelectorAll(".weight-input");
var dailyWeight = {};
var todayIso = getTodayIsoDate();
var todayWeightFromInput = null;
for(let i = 0; i < weightInputs.length; i++){
var dateKey = weightInputs[i].getAttribute("data-date");
var value = weightInputs[i].value;
var parsed = parseFloat(value);
if(value !== "" && Number.isFinite(parsed)){
dailyWeight[dateKey] = parsed;
if(dateKey === todayIso){
todayWeightFromInput = parsed;
}
}
}

if(showAlert && (todayWeightFromInput === null || !Number.isFinite(todayWeightFromInput))){
alert("Please enter today weight in today's row.");
return;
}

localStorage.setItem(getUserDataKey("fitworldDailyWeight", currentUserCode), JSON.stringify(dailyWeight));

checkProgressNotification(true);
renderMonthSummary();
var verdict = getProgressVerdict(currentUserCode, todayWeightFromInput, { requireToday: showAlert });
if(showAlert){
if(!verdict.valid){
alert(verdict.message);
return;
}
alert("Verdict: " + verdict.message + ". Progress saved successfully!");
}
}

function bindTrackingAutoSave(){
var checks = document.querySelectorAll(".progress-check");
var weights = document.querySelectorAll(".weight-input");

for(let i = 0; i < checks.length; i++){
checks[i].addEventListener("change", function(){
saveProgressInternal(false);
});
}

for(let i = 0; i < weights.length; i++){
weights[i].addEventListener("change", function(){
saveProgressInternal(false);
});
}
}

function checkProgressNotification(silentMode){
var checks = document.querySelectorAll(".progress-check");
var note = document.getElementById("progressNotification");
if(!checks.length || !note){
return;
}

var todayIso = getTodayIsoDate();
var missedDays = [];
for(let i = 0; i < checks.length; i++){
var dateKey = checks[i].getAttribute("data-date");
if(dateKey < todayIso && !checks[i].checked){
missedDays.push(formatIsoDate(dateKey));
}
}

var message = "";
if(missedDays.length){
note.className = "progress-note warning";
message = "Notification: You missed these days this month: " + missedDays.join(", ");
note.innerHTML = message;
}else{
note.className = "progress-note success";
message = "Great job. No missed days so far this month.";
note.innerHTML = message;
}

if(!silentMode){
alert(message);
}
}

function renderMonthSummary(){
var summaryElement = document.getElementById("monthSummary");
if(!summaryElement){
return;
}

var currentUserCode = getCurrentUserCode();
if(!currentUserCode){
return;
}

var checks = document.querySelectorAll(".progress-check");
if(!checks.length){
summaryElement.innerHTML = "";
return;
}

var todayIso = getTodayIsoDate();
var totalDays = checks.length;
var completedDays = 0;
var missedDays = 0;
for(let i = 0; i < checks.length; i++){
var dateKey = checks[i].getAttribute("data-date");
if(checks[i].checked){
completedDays += 1;
}
if(dateKey < todayIso && !checks[i].checked){
missedDays += 1;
}
}
var pendingDays = totalDays - completedDays - missedDays;
if(pendingDays < 0){
pendingDays = 0;
}

var adherence = totalDays ? ((completedDays / totalDays) * 100).toFixed(1) : "0.0";

var baseWeightRaw = localStorage.getItem(getUserDataKey("fitworldWeight", currentUserCode));
var baseWeight = baseWeightRaw ? Number(baseWeightRaw) : null;
var weightData = JSON.parse(localStorage.getItem(getUserDataKey("fitworldDailyWeight", currentUserCode)) || "{}");
var latestDate = "";
var latestWeight = null;
for(let i = 0; i < checks.length; i++){
var d = checks[i].getAttribute("data-date");
if(weightData[d] !== undefined && weightData[d] !== null){
if(d > latestDate){
latestDate = d;
latestWeight = Number(weightData[d]);
}
}
}

var weightStatus = "No weight update yet.";
if(baseWeight !== null && Number.isFinite(baseWeight) && latestWeight !== null && Number.isFinite(latestWeight)){
var diff = (latestWeight - baseWeight).toFixed(1);
if(Number(diff) > 0){
weightStatus = "Weight Gain: +" + diff + " kg (from " + baseWeight.toFixed(1) + " kg to " + latestWeight.toFixed(1) + " kg).";
}else if(Number(diff) < 0){
weightStatus = "Weight Loss: " + diff + " kg (from " + baseWeight.toFixed(1) + " kg to " + latestWeight.toFixed(1) + " kg).";
}else{
weightStatus = "Weight unchanged at " + latestWeight.toFixed(1) + " kg.";
}
}

var now = new Date();
var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
var isMonthEnd = now.getDate() === lastDay;
var monthEndText = isMonthEnd
? "<p><strong>Month-End Summary:</strong> Missed " + missedDays + " day(s), Completed " + completedDays + " day(s), Pending " + pendingDays + " day(s).</p>"
: "<p>Month-end summary will finalize on day " + lastDay + ".</p>";

var verdict = getProgressVerdict(currentUserCode, null, { requireToday: false });

summaryElement.innerHTML =
"<h4>Monthly Summary</h4>" +
"<p>Completed: " + completedDays + " | Missed: " + missedDays + " | Pending: " + pendingDays + "</p>" +
"<p>Activity Adherence: " + adherence + "%</p>" +
"<p>" + weightStatus + "</p>" +
"<p><strong>Progress Verdict:</strong> " + verdict.message + "</p>" +
monthEndText;
}

function calculateAdherencePercent(){
var checks = document.querySelectorAll(".progress-check");
var completedDays = 0;
for(let i = 0; i < checks.length; i++){
if(checks[i].checked){
completedDays += 1;
}
}
return checks.length ? (completedDays / checks.length) * 100 : 0;
}

function getFlexibleRateBand(category){
if(category === "Underweight"){
return { minRate: 0.002, maxRate: 0.009, trend: "gain" };
}
if(category === "Normal Weight"){
return { minRate: -0.0035, maxRate: 0.0035, trend: "maintain" };
}
if(category === "Overweight"){
return { minRate: -0.012, maxRate: -0.002, trend: "loss" };
}
if(category === "Obese"){
return { minRate: -0.015, maxRate: -0.003, trend: "loss" };
}
return { minRate: -0.0035, maxRate: 0.0035, trend: "maintain" };
}

function ensureBaselineForUser(currentUserCode){
var baselineWeightKey = getUserDataKey("fitworldBaselineWeight", currentUserCode);
var baselineDateKey = getUserDataKey("fitworldBaselineDate", currentUserCode);

var baselineWeightRaw = localStorage.getItem(baselineWeightKey);
var baselineDateRaw = localStorage.getItem(baselineDateKey);
var baselineWeight = baselineWeightRaw ? Number(baselineWeightRaw) : null;
var baselineDate = baselineDateRaw || "";

if(Number.isFinite(baselineWeight) && baselineDate){
return { weight: baselineWeight, date: baselineDate };
}

var profileWeightRaw = localStorage.getItem(getUserDataKey("fitworldWeight", currentUserCode));
var profileWeight = profileWeightRaw ? Number(profileWeightRaw) : null;
var weightData = JSON.parse(localStorage.getItem(getUserDataKey("fitworldDailyWeight", currentUserCode)) || "{}");
var todayIso = getTodayIsoDate();
var earliestDate = "";
var earliestWeight = null;

for(var dateKey in weightData){
if(Object.prototype.hasOwnProperty.call(weightData, dateKey)){
var parsed = Number(weightData[dateKey]);
if(Number.isFinite(parsed) && (earliestDate === "" || dateKey < earliestDate)){
earliestDate = dateKey;
earliestWeight = parsed;
}
}
}

if(earliestWeight !== null){
baselineWeight = earliestWeight;
baselineDate = earliestDate;
}else if(Number.isFinite(profileWeight)){
baselineWeight = profileWeight;
baselineDate = todayIso;
}

if(Number.isFinite(baselineWeight) && baselineDate){
localStorage.setItem(baselineWeightKey, String(baselineWeight));
localStorage.setItem(baselineDateKey, baselineDate);
return { weight: baselineWeight, date: baselineDate };
}

return { weight: null, date: "" };
}

function getProgressVerdict(currentUserCode, todayWeightOverride, options){
var config = options || {};
var requireToday = config.requireToday === true;
var category = localStorage.getItem(getUserDataKey("fitworldBMICategory", currentUserCode)) || "";
var weightData = JSON.parse(localStorage.getItem(getUserDataKey("fitworldDailyWeight", currentUserCode)) || "{}");
var todayIso = getTodayIsoDate();
var latestDate = "";
var latestWeight = null;

if(todayWeightOverride !== null && Number.isFinite(todayWeightOverride)){
latestDate = todayIso;
latestWeight = Number(todayWeightOverride);
}else if(weightData[todayIso] !== undefined && weightData[todayIso] !== null){
latestDate = todayIso;
latestWeight = Number(weightData[todayIso]);
}else{
if(requireToday){
return { valid: false, message: "Please enter today weight in today's row." };
}
for(var dateKey in weightData){
if(
Object.prototype.hasOwnProperty.call(weightData, dateKey) &&
dateKey <= todayIso &&
dateKey > latestDate
){
latestDate = dateKey;
latestWeight = Number(weightData[dateKey]);
}
}
}

if(latestWeight === null || !Number.isFinite(latestWeight)){
return { valid: false, message: "Please enter today weight in today's row." };
}

var baseline = ensureBaselineForUser(currentUserCode);
if(!Number.isFinite(baseline.weight) || !baseline.date){
return { valid: false, message: "Baseline weight not found. Please calculate BMI again." };
}

var baseWeight = baseline.weight;
var baselineDate = new Date(baseline.date + "T00:00:00");
var todayDate = new Date(todayIso + "T00:00:00");
var diffMillis = todayDate.getTime() - baselineDate.getTime();
var elapsedDays = Math.max(1, Math.floor(diffMillis / 86400000));
var weeks = elapsedDays / 7;
var actualDelta = latestWeight - baseWeight;
var band = getFlexibleRateBand(category);
var expectedDeltaMin = baseWeight * band.minRate * weeks;
var expectedDeltaMax = baseWeight * band.maxRate * weeks;
var low = Math.min(expectedDeltaMin, expectedDeltaMax);
var high = Math.max(expectedDeltaMin, expectedDeltaMax);
var adherence = calculateAdherencePercent();
var adherenceText = adherence >= 50 ? "Good adherence" : "Low adherence";
var verdictText = "";

if(band.trend === "gain"){
if(actualDelta < 0){
verdictText = "Wrong direction";
}else if(actualDelta < low){
verdictText = "Too less change";
}else if(actualDelta > high){
verdictText = "Too much change";
}else{
verdictText = "Correct";
}
}else if(band.trend === "loss"){
if(actualDelta > 0){
verdictText = "Wrong direction";
}else if(actualDelta > high){
verdictText = "Too less change";
}else if(actualDelta < low){
verdictText = "Too much change";
}else{
verdictText = "Correct";
}
}else{
if(actualDelta < low || actualDelta > high){
verdictText = "Too much change";
}else{
verdictText = "Correct";
}
}

return { valid: true, message: verdictText + " (" + adherenceText + ")" };
}

function loadTrackingPageData(){
var trackerSection = document.getElementById("trackerSection");
if(!trackerSection){
return;
}

var currentUserCode = getCurrentUserCode();
if(!currentUserCode){
window.location.href = "login.html?next=tracker";
return;
}

var savedPlan = localStorage.getItem(getUserDataKey("fitworldWeeklyPlan", currentUserCode));
var savedCategory = localStorage.getItem(getUserDataKey("fitworldBMICategory", currentUserCode));
var note = document.getElementById("progressNotification");

if(!savedPlan || !savedCategory){
trackerSection.style.display = "block";
if(note){
note.className = "progress-note warning";
note.innerHTML = "Please calculate BMI in dashboard first to generate your timetable.";
}
return;
}

var weeklyPlan = JSON.parse(savedPlan);
renderProgressTracker(weeklyPlan, savedCategory);
}

function showTrackProgressButton(){
var block = document.getElementById("trackProgressBlock");
if(block){
block.style.display = "block";
}
}

function loadDashboardData(){
var scheduleElement = document.getElementById("schedule");
if(!scheduleElement){
return;
}

var currentUserCode = getCurrentUserCode();
if(!currentUserCode){
return;
}

var savedPlan = localStorage.getItem(getUserDataKey("fitworldWeeklyPlan", currentUserCode));
var savedCategory = localStorage.getItem(getUserDataKey("fitworldBMICategory", currentUserCode));
var savedBmi = localStorage.getItem(getUserDataKey("fitworldBMIValue", currentUserCode));
var savedHeight = localStorage.getItem(getUserDataKey("fitworldHeight", currentUserCode));
var savedWeight = localStorage.getItem(getUserDataKey("fitworldWeight", currentUserCode));
var resultElement = document.getElementById("result");
var heightInput = document.getElementById("height");
var weightInput = document.getElementById("weight");

if(heightInput && savedHeight){
heightInput.value = savedHeight;
}
if(weightInput && savedWeight){
weightInput.value = savedWeight;
}

if(savedPlan && savedCategory){
var weeklyPlan = JSON.parse(savedPlan);
if(resultElement && savedBmi){
resultElement.innerHTML = "Your BMI: " + savedBmi + " (" + savedCategory + ")";
}
renderWeeklySchedule(weeklyPlan);
showTrackProgressButton();
}
}

/* BMI CALCULATOR + WEEKLY PLAN */

function calculateBMI(){

let height=document.getElementById("height").value;
let weight=document.getElementById("weight").value;

if(height=="" || weight==""){

alert("Please enter height and weight");
return;

}

var currentUserCode = getCurrentUserCode();
if(!currentUserCode){
alert("Please login first.");
window.location.href = "login.html";
return;
}

height=height/100;

let bmi=(weight/(height*height)).toFixed(2);

let category="";
let weeklyPlan=[];

if(bmi<18.5){

category="Underweight";

weeklyPlan=[
{ day:"Mon", workout:"Strength Training", diet:"Oats, eggs, rice, chicken, nuts, milk" },
{ day:"Tue", workout:"Yoga + Mobility", diet:"Paneer/tofu, sweet potato, banana smoothie" },
{ day:"Wed", workout:"Upper Body Workout", diet:"Whole grains, lean meat, peanut butter toast" },
{ day:"Thu", workout:"Active Rest", diet:"High-calorie balanced meals + fruit snacks" },
{ day:"Fri", workout:"Lower Body Workout", diet:"Rice, lentils, fish/chickpeas, yogurt" },
{ day:"Sat", workout:"Light Cardio", diet:"Pasta, eggs, avocado, mixed nuts" },
{ day:"Sun", workout:"Rest + Stretching", diet:"Recovery meals with protein and healthy fats" }
];

}

else if(bmi>=18.5 && bmi<25){

category="Normal Weight";

weeklyPlan=[
{ day:"Mon", workout:"Cardio (30 mins)", diet:"Balanced plate: protein, carbs, vegetables" },
{ day:"Tue", workout:"Strength Training", diet:"Eggs/beans, brown rice, salad, fruit" },
{ day:"Wed", workout:"Yoga", diet:"Light meals, hydration, nuts and seeds" },
{ day:"Thu", workout:"Cycling", diet:"Complex carbs + lean protein + greens" },
{ day:"Fri", workout:"Full Body Workout", diet:"Protein-rich meals + yogurt + whole grains" },
{ day:"Sat", workout:"Light Jogging", diet:"Seasonal fruits, lentils, grilled veggies" },
{ day:"Sun", workout:"Rest", diet:"Maintenance calories with clean whole foods" }
];

}

else if(bmi>=25 && bmi<30){

category="Overweight";

weeklyPlan=[
{ day:"Mon", workout:"Running (40 mins)", diet:"High-fiber meals, low sugar, lean protein" },
{ day:"Tue", workout:"HIIT Workout", diet:"Protein + vegetables + controlled carbs" },
{ day:"Wed", workout:"Cycling", diet:"Salads, sprouts, grilled chicken/tofu" },
{ day:"Thu", workout:"Core Workout", diet:"Portion-controlled meals, avoid fried foods" },
{ day:"Fri", workout:"Swimming", diet:"Fish/beans, quinoa, steamed vegetables" },
{ day:"Sat", workout:"Brisk Walking", diet:"Soup + salad + nuts + fruit" },
{ day:"Sun", workout:"Yoga", diet:"Light detox-style meals and hydration" }
];

}

else{

category="Obese";

weeklyPlan=[
{ day:"Mon", workout:"Walking (30 mins)", diet:"Low-calorie balanced meals, no sugary drinks" },
{ day:"Tue", workout:"Light Yoga", diet:"Vegetable-rich meals + lean protein" },
{ day:"Wed", workout:"Walking + Stretching", diet:"Small frequent meals, high fiber foods" },
{ day:"Thu", workout:"Swimming / Aqua Walk", diet:"Whole grains + legumes + salads" },
{ day:"Fri", workout:"Easy Cycling", diet:"Steamed foods, low oil, controlled portions" },
{ day:"Sat", workout:"Breathing + Meditation", diet:"Light meals, fruits, hydration focus" },
{ day:"Sun", workout:"Rest", diet:"Healthy recovery meals, avoid processed food" }
];

}

var resultElement = document.getElementById("result") || document.getElementById("bmiResult");
if(resultElement){
resultElement.innerHTML="Your BMI: "+bmi+" ("+category+")";
}

localStorage.setItem(getUserDataKey("fitworldHeight", currentUserCode), document.getElementById("height").value);
localStorage.setItem(getUserDataKey("fitworldWeight", currentUserCode), document.getElementById("weight").value);
localStorage.setItem(getUserDataKey("fitworldBMIValue", currentUserCode), bmi);
localStorage.setItem(getUserDataKey("fitworldBMICategory", currentUserCode), category);
localStorage.setItem(getUserDataKey("fitworldWeeklyPlan", currentUserCode), JSON.stringify(weeklyPlan));
localStorage.setItem(getUserDataKey("fitworldBaselineWeight", currentUserCode), document.getElementById("weight").value);
localStorage.setItem(getUserDataKey("fitworldBaselineDate", currentUserCode), getTodayIsoDate());

renderWeeklySchedule(weeklyPlan);
showTrackProgressButton();

}