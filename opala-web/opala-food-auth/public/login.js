document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login__form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if(!email || !password) {
      alert('Credenciais inválidas!')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        Cookies.set('authorization', token, { expires: 1, path: '/' });
        window.location.href = '/home';
      } else {
        alert('Email ou senhas inválidos.')
      }
    } catch (error) {
      
      alert('Ocorreu um erro desconhecido ao fazer o login')
    }
  });
});
