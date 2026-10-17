// EasyWay Germany - Interactions & Client Scripts

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dismissible Flash Messages
  const flashAlerts = document.querySelectorAll('.flash-alert');
  flashAlerts.forEach(alert => {
    const closeBtn = alert.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
      });
    }

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      if (alert && alert.parentElement) {
        alert.style.transition = 'opacity 0.5s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
      }
    }, 6000);
  });

  // 2. Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#FFFFFF';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        navLinks.style.borderBottom = '1px solid var(--border)';
      }
    });
  }

  // 3. Payment Method Switcher (in checkout)
  const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
  const paymentNotes = document.querySelectorAll('.payment-note');

  if (paymentRadios.length > 0) {
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = e.target.value;
        paymentNotes.forEach(note => {
          if (note.dataset.method === val) {
            note.style.display = 'block';
          } else {
            note.style.display = 'none';
          }
        });
      });
    });
  }
});
