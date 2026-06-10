const API_BASE = 'http://localhost:3000/api/users';

const showAlert = (message) => {
    window.alert(message);
};

const handleLogin = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username')?.value.trim();
    const password = document.querySelector('#password')?.value.trim();

    if (!username || !password) {
        return showAlert('ユーザー名とパスワードを入力してください。');
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return showAlert(data.error || 'ログインに失敗しました。');
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = './homePage.html';
    } catch (error) {
        showAlert('サーバーに接続できませんでした。後でもう一度お試しください。');
        console.error(error);
    }
};

const handleRegister = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#new-username')?.value.trim();
    const password = document.querySelector('#new-password')?.value.trim();
    const confirmPassword = document.querySelector('#confirm-password')?.value.trim();

    if (!username || !password || !confirmPassword) {
        return showAlert('すべての項目を入力してください。');
    }

    if (password !== confirmPassword) {
        return showAlert('パスワードと確認用パスワードが一致しません。');
    }

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return showAlert(data.error || '登録に失敗しました。');
        }

        showAlert('登録が完了しました。ログイン画面へ移動します。');
        window.location.href = './login.html';
    } catch (error) {
        showAlert('サーバーに接続できませんでした。後でもう一度お試しください。');
        console.error(error);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
