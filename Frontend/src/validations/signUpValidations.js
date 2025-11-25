const validateSignup = (data) => {
    let errors = {};

    if (!data.name?.trim()) {
        errors.name = "Full name is required";
    }

    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Enter a valid email address";
    }

    if (!data.password?.trim()) {
        errors.password = "Password is required";
    } else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};

export default validateSignup;