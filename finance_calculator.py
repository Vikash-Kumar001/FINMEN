import re

def calculate_simple_interest(P, R, T):
    try:
        SI = (P * R * T) / 100
        return f"Simple Interest = (P × R × T) / 100 = ({P} × {R} × {T}) / 100 = ₹{SI:.2f}"
    except Exception as e:
        return f"Error calculating simple interest: {e}"

def calculate_compound_interest(P, R, T, n=1):
    try:
        A = P * (1 + R / (100 * n))**(n * T)
        CI = A - P
        return f"Compound Interest = ₹{CI:.2f} (Total Amount: ₹{A:.2f})"
    except Exception as e:
        return f"Error calculating compound interest: {e}"

def calculate_emi(P, R, T):
    try:
        r = R / (12 * 100)
        n = T * 12
        emi = (P * r * (1 + r)**n) / ((1 + r)**n - 1)
        return f"EMI = ₹{emi:.2f} for {T} years"
    except Exception as e:
        return f"Error calculating EMI: {e}"

def adjust_for_inflation(value_now, rate, years):
    try:
        adjusted = value_now / ((1 + rate / 100) ** years)
        return f"Adjusted value after {years} years of {rate}% inflation: ₹{adjusted:.2f}"
    except Exception as e:
        return f"Error adjusting for inflation: {e}"

def convert_currency(amount_inr, rate_inr_to_usd):
    try:
        usd = amount_inr / rate_inr_to_usd
        return f"₹{amount_inr} = ${usd:.2f} at ₹{rate_inr_to_usd}/USD"
    except Exception as e:
        return f"Error in currency conversion: {e}"

# === Parser and Dispatcher ===
def parse_and_calculate(input_text, fallback_fn=None):
    input_lower = input_text.lower()
    try:
        # Extract numbers from input
        nums = [float(n) for n in re.findall(r"\d+(?:\.\d+)?", input_text)]
        
        # Match to functions
        if "simple interest" in input_lower and len(nums) >= 3:
            return calculate_simple_interest(nums[0], nums[1], nums[2])
        
        if "compound interest" in input_lower and len(nums) >= 3:
            return calculate_compound_interest(nums[0], nums[1], nums[2])
        
        if "emi" in input_lower and len(nums) >= 3:
            return calculate_emi(nums[0], nums[1], nums[2])
        
        if "inflation" in input_lower and len(nums) >= 3:
            return adjust_for_inflation(nums[0], nums[1], nums[2])
        
        if "convert" in input_lower and "usd" in input_lower and len(nums) >= 2:
            return convert_currency(nums[0], nums[1])
    
    except Exception as e:
        return f"[Parser Error] {e}"

    # Fallback to Gemini if not matched
    if fallback_fn:
        return fallback_fn(input_text)

    return "Unable to parse or calculate this financial query."
