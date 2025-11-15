// Custom JavaScript for PlanB Caravaning Website

document.addEventListener('DOMContentLoaded', function() {
    console.log('PlanB Caravaning Website geladen!');
    
    
    // Mobile Menu Dropdown Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    
    if (mobileMenuBtn && mobileMenuDropdown) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            mobileMenuDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking on menu item
        mobileMenuDropdown.querySelectorAll('.mobile-menu-item').forEach(item => {
            item.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileMenuDropdown.classList.remove('active');
            });
        });
    }
    
    // Smooth Scrolling für Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Calculate offset based on screen size
                    const isMobile = window.innerWidth <= 768;
                    const offset = isMobile ? (window.innerWidth <= 576 ? 70 : 75) : 76; // Compact navbar on mobile, full navbar on desktop
                    const offsetTop = Math.max(0, target.offsetTop - offset);
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Navbar Background Change on Scroll
    const navbar = document.getElementById('mainNav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .desktop-nav-link, .mobile-nav-item, .mobile-menu-item');
    
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        const isMobile = window.innerWidth <= 768;
        const offset = isMobile ? (window.innerWidth <= 576 ? 70 : 75) : 150;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - offset;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href');
                    if (linkHref === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Initial check
    
    // Form Submission Handler
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values (handle different form structures)
            const nameField = document.getElementById('name') || document.getElementById('vorname');
            const emailField = document.getElementById('email');
            const nachrichtField = document.getElementById('nachricht');
            
            if (nameField && emailField && nachrichtField) {
                // Show success message (in real application, this would send to server)
                alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden. Bitte vereinbaren Sie vorab einen Termin für einen Besuch.');
                
                // Reset form
                contactForm.reset();
            }
        });
    }
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.car-card, .service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Scroll to top functionality (optional)
    let scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollTopBtn.className = 'btn btn-primary rounded-circle position-fixed';
    scrollTopBtn.style.cssText = 'bottom: 30px; right: 30px; width: 50px; height: 50px; z-index: 1000; display: none; box-shadow: 0 4px 8px rgba(0,0,0,0.3);';
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Service Details Data
    const serviceDetails = {
        service1: {
            title: 'Instandsetzungen',
            icon: 'bi-tools',
            content: 'Wir reparieren und setzen Ihr Reisemobil oder Caravan fachgerecht instand. Von kleineren Schäden bis hin zu umfangreichen Reparaturen – unsere erfahrenen Techniker sorgen dafür, dass Ihr Fahrzeug wieder in bestem Zustand ist. Wir arbeiten mit hochwertigen Materialien und Ersatzteilen und garantieren eine sorgfältige Ausführung aller Arbeiten. Egal ob Schäden am Aufbau, an der Elektrik oder an der Mechanik – wir finden die passende Lösung für Ihr Problem.'
        },
        service2: {
            title: 'Einbauten',
            icon: 'bi-wrench-adjustable',
            content: 'Wir installieren professionell Zubehör und Ausstattung in Ihr Reisemobil oder Caravan. Ob Solaranlagen, Satellitensysteme, Fahrradträger oder zusätzliche Batterien – wir planen und realisieren jeden Einbau sorgfältig und nach Herstellerrichtlinien. Dabei achten wir auf eine saubere Verlegung von Kabeln und Leitungen sowie auf die Einhaltung aller Sicherheitsstandards. Lassen Sie sich von uns beraten, welche Einbauten für Ihr Fahrzeug sinnvoll sind.'
        },
        service3: {
            title: 'Umbauten',
            icon: 'bi-gear-wide-connected',
            content: 'Individuelle Umbauten nach Ihren persönlichen Wünschen und Anforderungen. Wir verwandeln Ihr Reisemobil oder Caravan nach Ihren Vorstellungen – ob es um die Optimierung des Innenraums, den Einbau zusätzlicher Schränke, die Erweiterung der Küche oder die Anpassung der Schlafplätze geht. In einem ausführlichen Beratungsgespräch erarbeiten wir gemeinsam die beste Lösung für Ihre Bedürfnisse und setzen diese dann präzise um.'
        },
        service4: {
            title: 'Gastanks Einbau & Prüfung',
            icon: 'bi-fuel-pump',
            content: 'Der sichere Einbau und die regelmäßige Prüfung von Gastanks ist eine unserer Kernkompetenzen. Wir führen alle Arbeiten nach den geltenden Vorschriften und Sicherheitsstandards durch. Dazu gehören die fachgerechte Installation, die Dichtheitsprüfung sowie die regelmäßige Überprüfung bestehender Anlagen. Wir dokumentieren alle Arbeiten sorgfältig und stellen Ihnen die erforderlichen Nachweise aus. Ihre Sicherheit steht bei uns an erster Stelle.'
        },
        service5: {
            title: 'Concorde Service',
            icon: 'bi-shield-check',
            content: 'Als offizieller Concorde Reisemobile Servicepartner bieten wir Ihnen die volle Expertise für alle Concorde Modelle. Wir führen Wartungen, Reparaturen und Serviceleistungen nach Herstellervorgaben durch und haben Zugriff auf Original-Ersatzteile. Unsere Techniker sind speziell für Concorde Fahrzeuge geschult und kennen die Besonderheiten dieser hochwertigen Reisemobile. Profitieren Sie von unserer langjährigen Erfahrung und dem direkten Zugang zu Concorde-Serviceinformationen.'
        },
        service6: {
            title: 'Dometic Service',
            icon: 'bi-snow',
            content: 'Als autorisierter Dometic Service Provider kümmern wir uns um alle Dometic Geräte in Ihrem Fahrzeug. Ob Kühlschrank, Klimaanlage, Heizung, Toilette oder andere Dometic Produkte – wir reparieren, warten und installieren diese Geräte fachgerecht. Wir haben Zugriff auf Original-Ersatzteile und Service-Dokumentationen. Unsere Techniker sind regelmäßig geschult und kennen die neuesten Dometic Produkte und deren Besonderheiten.'
        },
        service7: {
            title: 'Technische Prüfung',
            icon: 'bi-clipboard-check',
            content: 'Vor dem Kauf eines gebrauchten Reisemobils empfehlen wir eine umfassende technische Prüfung. Wir untersuchen alle wichtigen Komponenten wie Aufbau, Elektrik, Wasser- und Gasanlage, Fahrwerk und Motor. Sie erhalten von uns einen detaillierten Zustandsbericht mit allen festgestellten Mängeln und einer realistischen Einschätzung des Fahrzeugzustands. Diese Prüfung gibt Ihnen Sicherheit bei Ihrer Kaufentscheidung und kann bei Preisverhandlungen hilfreich sein.'
        },
        service8: {
            title: 'Schnäppchenecke',
            icon: 'bi-tag-fill',
            content: 'In unserer Schnäppchenecke finden Sie regelmäßig exklusive Angebote und Sonderpreise für Reisemobile, und hochwertiges Zubehör. Wir bieten Ihnen Vorführfahrzeuge, Ausstellungsstücke und Sonderaktionen zu besonders attraktiven Konditionen. Lassen Sie sich von unseren aktuellen Schnäppchen überraschen und sparen Sie bares Geld bei Ihrem Traumfahrzeug oder beim passenden Zubehör. Schauen Sie regelmäßig vorbei, denn unsere Angebote wechseln und sind oft nur für kurze Zeit verfügbar.'
        },
        service9: {
            title: 'Zubehör & Ersatzteile',
            icon: 'bi-box-seam',
            content: 'Wir führen ein umfangreiches Sortiment an Zubehör und Ersatzteilen von unseren Partnern. Von praktischem Reisezubehör über technische Komponenten bis hin zu Original-Ersatzteilen – bei uns finden Sie alles, was Sie für Ihr Reisemobil oder Caravan benötigen. Durch unsere langjährigen Partnerschaften können wir Ihnen qualitativ hochwertige Produkte zu fairen Preisen anbieten. Gerne beraten wir Sie auch bei der Auswahl des passenden Zubehörs für Ihre individuellen Bedürfnisse.'
        }
    };
    
    // Service Card Click Handler
    const serviceCardHeaders = document.querySelectorAll('.service-card-header[data-service]');
    let currentService = null;
    let currentRow = null;
    
    serviceCardHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service');
            const rowNumber = this.getAttribute('data-row');
            const serviceData = serviceDetails[serviceId];
            const toggleBtn = this.querySelector('.service-toggle-btn');
            const toggleIcon = toggleBtn.querySelector('i');
            
            // Check if mobile or desktop
            const isMobile = window.innerWidth <= 768;
            
            // Get the appropriate panel (mobile or desktop)
            let targetPanel, targetContent;
            if (isMobile) {
                const serviceNum = serviceId.replace('service', '');
                targetPanel = document.getElementById(`serviceDetailsPanelMobile${serviceNum}`);
                targetContent = targetPanel.querySelector(`.service-details-content-mobile${serviceNum}`);
            } else {
                targetPanel = document.getElementById(`serviceDetailsPanelRow${rowNumber}`);
                targetContent = targetPanel.querySelector(`.service-details-content-row${rowNumber}`);
            }
            
            // Check if same service and panel is open
            const isSameService = currentService === serviceId && currentRow === rowNumber;
            const isPanelOpen = targetPanel.classList.contains('show');
            
            if (isSameService && isPanelOpen) {
                // Close current panel
                const bsCollapse = new bootstrap.Collapse(targetPanel, {
                    toggle: false
                });
                bsCollapse.hide();
                this.classList.remove('active');
                toggleBtn.classList.remove('active');
                toggleIcon.style.transform = 'rotate(0deg)';
                currentService = null;
                currentRow = null;
            } else {
                // Close all other panels first
                document.querySelectorAll('.service-details-panel-wrapper').forEach(panel => {
                    if (isMobile) {
                        // On mobile, close all mobile panels except current
                        if (panel.classList.contains('service-panel-mobile') && panel !== targetPanel && panel.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(panel, {
                                toggle: false
                            });
                            bsCollapse.hide();
                        }
                    } else {
                        // On desktop, close all desktop panels except current row
                        if (panel.id !== `serviceDetailsPanelRow${rowNumber}` && panel.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(panel, {
                                toggle: false
                            });
                            bsCollapse.hide();
                        }
                    }
                });
                
                // Reset all other cards
                serviceCardHeaders.forEach(h => {
                    if (h !== this) {
                        h.classList.remove('active');
                        const btn = h.querySelector('.service-toggle-btn');
                        const icon = btn.querySelector('i');
                        btn.classList.remove('active');
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Update current service
                currentService = serviceId;
                currentRow = rowNumber;
                
                // Activate current card
                this.classList.add('active');
                toggleBtn.classList.add('active');
                toggleIcon.style.transform = 'rotate(180deg)';
                
                // Update content
                targetContent.innerHTML = `
                    <h4>
                        <i class="bi ${serviceData.icon}"></i>
                        ${serviceData.title}
                    </h4>
                    <p>${serviceData.content}</p>
                `;
                
                // Show panel
                const bsCollapse = new bootstrap.Collapse(targetPanel, {
                    toggle: false
                });
                bsCollapse.show();
                
                // Scroll to panel smoothly (only on mobile, desktop already in view)
                if (isMobile) {
                    setTimeout(() => {
                        targetPanel.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                }
            }
        });
    });
    
    // Handle panel close for all panels
    document.querySelectorAll('.service-details-panel-wrapper').forEach(panel => {
        panel.addEventListener('hidden.bs.collapse', function() {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Mobile: find service number from panel ID
                const serviceNum = this.id.replace('serviceDetailsPanelMobile', '');
                const serviceId = `service${serviceNum}`;
                
                if (currentService === serviceId) {
                    serviceCardHeaders.forEach(header => {
                        if (header.getAttribute('data-service') === serviceId) {
                            header.classList.remove('active');
                            const btn = header.querySelector('.service-toggle-btn');
                            const icon = btn.querySelector('i');
                            btn.classList.remove('active');
                            icon.style.transform = 'rotate(0deg)';
                        }
                    });
                    currentService = null;
                    currentRow = null;
                }
            } else {
                // Desktop: find row number from panel ID
                const rowNum = this.id.replace('serviceDetailsPanelRow', '');
                if (currentRow === rowNum) {
                    serviceCardHeaders.forEach(header => {
                        if (header.getAttribute('data-row') === rowNum) {
                            header.classList.remove('active');
                            const btn = header.querySelector('.service-toggle-btn');
                            const icon = btn.querySelector('i');
                            btn.classList.remove('active');
                            icon.style.transform = 'rotate(0deg)';
                        }
                    });
                    currentService = null;
                    currentRow = null;
                }
            }
        });
    });
    
    // Partner Cards Collapse Logic
    const partnerCardHeaders = document.querySelectorAll('.partner-card-header[data-partner]');
    let currentPartner = null;
    
    partnerCardHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Don't trigger if clicking the toggle button directly
            if (e.target.closest('.partner-toggle-btn')) {
                return;
            }
            
            const partnerId = this.getAttribute('data-partner');
            const partnerNum = partnerId.replace('partner', '');
            const targetPanel = document.getElementById(`partnerDetailsPanel${partnerNum}`);
            
            if (!targetPanel) return;
            
            const toggleBtn = this.querySelector('.partner-toggle-btn');
            const toggleIcon = toggleBtn.querySelector('i');
            
            // Toggle active state
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Close this panel
                const bsCollapse = new bootstrap.Collapse(targetPanel, {
                    toggle: false
                });
                bsCollapse.hide();
                this.classList.remove('active');
                toggleIcon.style.transform = 'rotate(0deg)';
                currentPartner = null;
            } else {
                // Close other panels
                partnerCardHeaders.forEach(h => {
                    if (h !== this) {
                        h.classList.remove('active');
                        const btn = h.querySelector('.partner-toggle-btn');
                        const icon = btn.querySelector('i');
                        icon.style.transform = 'rotate(0deg)';
                        
                        const otherPartnerId = h.getAttribute('data-partner');
                        const otherPartnerNum = otherPartnerId.replace('partner', '');
                        const otherPanel = document.getElementById(`partnerDetailsPanel${otherPartnerNum}`);
                        if (otherPanel && otherPanel.classList.contains('show')) {
                            const bsCollapse = new bootstrap.Collapse(otherPanel, {
                                toggle: false
                            });
                            bsCollapse.hide();
                        }
                    }
                });
                
                // Open this panel
                this.classList.add('active');
                toggleIcon.style.transform = 'rotate(180deg)';
                currentPartner = partnerId;
                
                const bsCollapse = new bootstrap.Collapse(targetPanel, {
                    toggle: false
                });
                bsCollapse.show();
            }
        });
        
        // Also handle toggle button clicks
        const toggleBtn = header.querySelector('.partner-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                header.click();
            });
        }
    });
    
    // Handle panel close
    document.querySelectorAll('.partner-details-panel-wrapper').forEach(panel => {
        panel.addEventListener('hidden.bs.collapse', function() {
            const partnerNum = this.id.replace('partnerDetailsPanel', '');
            const partnerId = `partner${partnerNum}`;
            
            if (currentPartner === partnerId) {
                partnerCardHeaders.forEach(header => {
                    if (header.getAttribute('data-partner') === partnerId) {
                        header.classList.remove('active');
                        const btn = header.querySelector('.partner-toggle-btn');
                        const icon = btn.querySelector('i');
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
                currentPartner = null;
            }
        });
    });
});
