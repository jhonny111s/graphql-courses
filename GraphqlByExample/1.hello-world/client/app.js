const GRAPHQL_URL = 'http://localhost:9000'

async function fetchGreeting() {
    const params = {
        query: `
            query {
                greeting
            }
        `
    }


    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })

    const { data } = await response.json();
    console.log(data);
    return data
}


const element = document.getElementById('greeting');

fetchGreeting().then(data => {
    element.textContent = data.greeting
})