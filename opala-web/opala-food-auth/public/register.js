document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('register__form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const gender = document.getElementById('gender').value;
    const name = document.getElementById('name').value;

    if (!email || !password || !gender || !name) {
      alert('Credenciais inválidas')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, gender }),
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        alert('Dados inválidos')
      }
    } catch (error) {
      alert('Ocorreu um erro desconhecido ao fazer o cadastro')
    }
  });
});
