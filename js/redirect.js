window.addEventListener('load', async () => {
    const code = decodeURI((window.location).toString()).split("code=")[1].split("&scope=")[0].replace("%2F", "/")
    console.log(code)

    const data = JSON.stringify({
        "code": code,
        "client_secret": "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",
        "client_id": "14536006715-6cm2ajnipa0qr8v1s5ot1h2e5jrmg14s.apps.googleusercontent.com",
        "redirect_uri": "https://fabriziogasparini.github.io/SpikeBot/redirect.html",
        "grant_type": "authorization_code"
    })

    var response = await fetch('https://oauth2.googleapis.com/token', {
        "body": data, "method": "post"
    })

    const json = await response.json()
    console.log(json)

    if (response.status == 200)
    {
        const token = document.getElementById("token")
        token.innerText = json["id_token"]
    }
})

function copy() {
  // Get the text field
  var copyText = document.getElementById("token");

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.innerText);

  // Alert the copied text
  alert("Copied the text: " + copyText.innerText);
}