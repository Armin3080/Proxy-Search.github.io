document.getElementById('proxy-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    
    fetch(proxyUrl)
        .then(response => response.text())
        .then(data => {
            const newWindow = window.open();
            newWindow.document.write(data);
        })
        .catch(error => console.error('Error fetching the URL:', error));
});
