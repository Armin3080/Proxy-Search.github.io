document.getElementById('proxy-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('url').value;
    fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response => response.text())
        .then(data => {
            const newWindow = window.open();
            newWindow.document.write(data);
        })
        .catch(error => console.error('Error fetching the URL:', error));
});
