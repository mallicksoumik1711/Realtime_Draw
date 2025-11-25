

const validateSignin = (data) => {
    let errors = {};

    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Enter a valid email";
    }

    if (!data.password?.trim()) {
        errors.password = "Password is required";
    }

    return errors;
};

export default validateSignin;