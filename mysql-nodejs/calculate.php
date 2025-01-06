<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Read the raw POST data
$input = file_get_contents("php://input");

// Check if input is empty
if (empty($input)) {
    echo json_encode(["error" => "No input received", "rawInput" => $input]);
    exit;
}

// Decode the JSON input
$data = json_decode($input, true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Invalid JSON payload: " . json_last_error_msg(), "rawInput" => $input]);
    exit;
}

// Validate the required fields
$requiredFields = ['principal', 'monthlyPayment', 'termMonths', 'startDate', 'interestRates', 'extraPayment', 'extraPaymentDate'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["error" => "Missing required field: $field", "rawInput" => $input]);
        exit;
    }
}

// Refinance calculation logic
$principal = $data['principal'];
$monthlyPayment = $data['monthlyPayment'];
$termMonths = $data['termMonths'];
$startDate = $data['startDate'];
$interestRates = $data['interestRates'];
$extraPayment = $data['extraPayment'];
$extraPaymentDate = $data['extraPaymentDate'];

$principalRemaining = $principal;
$monthsElapsed = 0;
$currentRateIndex = 0;
$results = [];

// Helper function to determine if a year is a leap year
function isLeapYear($year) {
    return ($year % 4 === 0 && $year % 100 !== 0) || $year % 400 === 0;
}

// Helper function to get the number of days in a month
function daysInMonth($year, $month) {
    $daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ($month == 1 && isLeapYear($year)) return 29;
    return $daysInMonths[$month];
}

while ($monthsElapsed < $termMonths && $principalRemaining > 0) {
    $currentRate = $interestRates[$currentRateIndex] ?? $interestRates[$currentRateIndex - 1];

    $interest = ($principalRemaining * $currentRate * daysInMonth(date("Y", strtotime($startDate)), date("m", strtotime($startDate)) - 1)) / 365;

    // Deduct interest from the monthly payment
    $principalPaid = max(0, $monthlyPayment - $interest);
    $principalRemaining = max(0, $principalRemaining - $principalPaid);

    // Apply extra payment after the specified date
    if (strtotime($startDate) >= strtotime($extraPaymentDate)) {
        $monthlyPayment = $extraPayment;
    }

    // Add the details for this month
    $results[] = [
        'month' => $monthsElapsed + 1,
        'date' => date("Y-m-d", strtotime($startDate)),
        'rate' => round($currentRate * 100, 2) . "%",
        'monthlyPayment' => number_format($monthlyPayment, 2),
        'interest' => number_format($interest, 2),
        'principalPaid' => number_format($principalPaid, 2),
        'remainingPrincipal' => number_format($principalRemaining, 2)
    ];

    // Move to the next month
    $startDate = date("Y-m-d", strtotime("+1 month", strtotime($startDate)));
    $monthsElapsed++;

    // Change interest rate every 12 months (as example)
    if ($monthsElapsed % 12 === 0 && $currentRateIndex < count($interestRates) - 1) {
        $currentRateIndex++;
    }
}

// Return the results as a JSON response
echo json_encode([
    "success" => true,
    "data" => $results
]);
?>
