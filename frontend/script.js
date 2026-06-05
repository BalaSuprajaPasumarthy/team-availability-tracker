const API = "http://127.0.0.1:3000/users";

async function loadUsers() {

    const response = await fetch(API);
    const users = await response.json();

    const total = users.length;

    const available =
        users.filter(user => user.available).length;

    const unavailable =
        total - available;

    const percentage =
        total > 0
            ? Math.round((available / total) * 100)
            : 0;

    document.getElementById("stats").innerHTML = `
        Total Members: ${total} |
        Available: ${available} |
        Unavailable: ${unavailable} |
        Availability Rate: ${percentage}%
    `;

    document.getElementById("progressBar").style.width =
        percentage + "%";

    if (percentage >= 80) {
        document.getElementById("teamStatus").innerHTML =
            "🟢 Team Status: Excellent";
    }
    else if (percentage >= 50) {
        document.getElementById("teamStatus").innerHTML =
            "🟡 Team Status: Moderate";
    }
    else {
        document.getElementById("teamStatus").innerHTML =
            "🔴 Team Status: Critical";
    }

    const container =
        document.getElementById("users");

    container.innerHTML = "";

    users.forEach((user) => {

        const div =
            document.createElement("div");

        div.className =
            user.available
                ? "user-card available-card"
                : "user-card unavailable-card";

        div.innerHTML = `
            <div>
                <h3>
                    <span class="avatar">
                        ${user.name.charAt(0)}
                    </span>
                    ${user.name}
                </h3>

                <span class="${
                    user.available
                        ? "available"
                        : "unavailable"
                }">
                    ${
                        user.available
                            ? "Available"
                            : "Unavailable"
                    }
                </span>
            </div>

            <input
                type="checkbox"
                ${user.available ? "checked" : ""}
            >
        `;

        const toggle =
            div.querySelector("input");

        toggle.addEventListener(
            "change",
            async () => {

                await fetch(
                    `${API}/${user.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            available:
                                toggle.checked
                        })
                    }
                );

                document.getElementById("message").innerText =
                    `✅ ${user.name} status updated successfully`;

                document.getElementById("lastUpdated").innerText =
                    "Last Updated: " +
                    new Date().toLocaleTimeString();

                setTimeout(() => {
                    document.getElementById("message").innerText = "";
                }, 2000);

                loadUsers();
            }
        );

        container.appendChild(div);
    });
}

loadUsers();