document.querySelectorAll('.question').forEach(question => {
    question.addEventListener('click', () => {
        question.classList.toggle('active');
    });
});