from sympy import symbols, Eq, solve, factor, simplify, sympify
import re

x = symbols('x')  # Default symbol

def solve_equation(expr: str):
    try:
        lhs, rhs = expr.replace(" ", "").split("=")
        equation = Eq(sympify(lhs), sympify(rhs))
        solution = solve(equation)
        return (
            f"Solving: {expr}\n"
            f"Step 1: Move all terms to one side → {lhs} - ({rhs}) = 0\n"
            f"Step 2: Simplify → {simplify(sympify(lhs) - sympify(rhs))} = 0\n"
            f"Step 3: Solve for x → x = {solution}"
        )
    except Exception as e:
        return f"Error solving equation: {e}"

def factor_expression(expr: str):
    try:
        result = factor(sympify(expr))
        return f"Factored form of {expr} is {result}"
    except Exception as e:
        return f"Error factoring expression: {e}"

def compute_speed(distance_km, time_hr):
    try:
        speed = distance_km / time_hr
        return f"Average speed = {speed} km/h"
    except Exception as e:
        return f"Error computing speed: {e}"

def area_of_triangle(base_cm, height_cm):
    try:
        area = 0.5 * base_cm * height_cm
        return f"Area = 0.5 × {base_cm} × {height_cm} = {area} cm²"
    except Exception as e:
        return f"Error computing area: {e}"

def parse_and_solve(input_text, fallback_fn=None):
    try:
        input_lower = input_text.lower()

        if "area of triangle" in input_lower:
            nums = [int(n) for n in re.findall(r'\d+', input_text)]
            if len(nums) >= 2:
                return area_of_triangle(nums[0], nums[1])

        if "speed" in input_lower:
            nums = [int(n) for n in re.findall(r'\d+', input_text)]
            if len(nums) >= 2:
                return compute_speed(nums[0], nums[1])

        if "solve" in input_lower and "=" in input_lower:
            expr = input_lower.replace("solve", "").strip()
            return solve_equation(expr)

        if "factor" in input_lower:
            expr = input_lower.replace("factor", "").strip()
            return factor_expression(expr)

    except Exception as e:
        return f"[Parser Error] {e}"

    # Fallback to Gemini for other math problems
    if fallback_fn:
        return fallback_fn(input_text)

    return "Unable to parse or solve this math problem."
