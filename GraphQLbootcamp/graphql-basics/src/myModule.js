const message = 'message from module';
const name = "jhony";
const location = "colombia";

const greeting = (name) => {
    return `Greeting ${name}`
}

export { message, name, greeting, location as default } 