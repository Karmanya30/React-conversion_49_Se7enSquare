const storedUser = (() => {
    try {
        return JSON.parse(localStorage.getItem('nexus_user') || localStorage.getItem('currentUser') || '{}');
    } catch {
        return {};
    }
})();

fetch("http://localhost:3000/api/users", {
    headers: {
        "x-role": storedUser.role || "admin",
        ...(storedUser.id ? { "x-user-id": String(storedUser.id) } : {})
    }
})
    .then(response => response.json())
    .then(users => {
        const table = document.getElementById("userTable");
        table.innerHTML = "";

        users.forEach(user => {
            table.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
      </tr>
    `;
        });
    })
    .catch(error => console.log("Fetch Error:", error));