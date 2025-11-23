// Custom JavaScript for PlanB Website

document.addEventListener('DOMContentLoaded', function() {
    console.log('PlanB Website geladen!');
    
    
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
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check reCAPTCHA
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                const recaptchaError = document.getElementById('recaptcha-error');
                if (recaptchaError) {
                    recaptchaError.textContent = 'Bitte bestätigen Sie, dass Sie kein Roboter sind (reCAPTCHA).';
                    recaptchaError.style.display = 'block';
                } else {
                    alert('Bitte bestätigen Sie, dass Sie kein Roboter sind (reCAPTCHA).');
                }
                return;
            }
            
            // Hide previous messages
            const formMessage = document.getElementById('form-message');
            const recaptchaError = document.getElementById('recaptcha-error');
            if (formMessage) formMessage.style.display = 'none';
            if (recaptchaError) recaptchaError.style.display = 'none';
            
            // Disable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Wird gesendet...';
            
            // Form data sammeln
            const formData = new FormData(contactForm);
            formData.append('g-recaptcha-response', recaptchaResponse);
            
            // AJAX Request
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show message
                if (formMessage) {
                    formMessage.className = 'alert ' + (data.success ? 'alert-success' : 'alert-danger');
                    formMessage.textContent = data.message;
                    formMessage.style.display = 'block';
                    
                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    alert(data.message);
                }
                
                // Reset form if successful
                if (data.success) {
                    contactForm.reset();
                    grecaptcha.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                if (formMessage) {
                    formMessage.className = 'alert alert-danger';
                    formMessage.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.';
                    formMessage.style.display = 'block';
                } else {
                    alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.');
                }
            })
            .finally(() => {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
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
    scrollTopBtn.className = 'btn btn-primary rounded-circle position-fixed scroll-to-top-btn';
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
            content: 'Wir reparieren und setzen Ihr Reisemobil fachgerecht instand. Von kleineren Schäden bis hin zu umfangreichen Reparaturen – unsere erfahrenen Techniker sorgen dafür, dass Ihr Fahrzeug wieder in bestem Zustand ist. Wir arbeiten mit hochwertigen Materialien und Ersatzteilen und garantieren eine sorgfältige Ausführung aller Arbeiten. Egal ob Schäden am Aufbau, an der Elektrik oder an der Mechanik – wir finden die passende Lösung für Ihr Problem.'
        },
        service2: {
            title: 'Einbauten',
            icon: 'bi-wrench-adjustable',
            content: 'Wir installieren professionell Zubehör und Ausstattung in Ihr Reisemobil. Wir planen und realisieren mit Ihnen zusammen jeden Einbau sorgfältig und nach Herstellerrichtlinien. Dabei achten wir auf eine saubere Verlegung von Kabeln und Leitungen sowie auf die Einhaltung aller Sicherheitsstandards.'
        },
        service3: {
            title: 'Umbauten',
            icon: 'bi-gear-wide-connected',
            content: 'Individuelle Umbauten nach Ihren persönlichen Wünschen und Anforderungen. Wir verwandeln Ihr Reisemobil nach Ihren Vorstellungen. In einem ausführlichen Beratungsgespräch erarbeiten wir gemeinsam die beste Lösung für Ihre Bedürfnisse und setzen diese dann präzise um.'
        },
        service4: {
            title: 'Gastanks Einbau & Prüfung',
            icon: 'bi-fuel-pump',
            content: 'Der sichere Einbau und die regelmäßige Prüfung von Gastanks  und Gastankflaschen ist eine unserer Kernkompetenzen. Wir führen alle Arbeiten nach den geltenden Vorschriften und Sicherheitsstandards durch. Dazu gehören die fachgerechten Gasprüfungen sowie die regelmäßige Überprüfung bestehender Anlagen. Wir dokumentieren alle Arbeiten sorgfältig und stellen Ihnen die erforderlichen Nachweise aus. Ihre Sicherheit steht bei uns an erster Stelle.'
        },
        service5: {
            title: 'Concorde Service',
            icon: 'bi-shield-check',
            content: 'Als offizieller Concorde Reisemobile Servicepartner sind wir stolz darauf ein Teil der Concorde Familie zu sein und bieten wir Ihnen die volle Expertise für alle Concorde Modelle. Wir führen Wartungen, Dichtigkeitsprüfungen Reparaturen und Serviceleistungen nach Herstellervorgaben durch und haben Zugriff auf Original-Ersatzteile . Unsere Techniker sind speziell für Concorde Fahrzeuge geschult und kennen die Besonderheiten dieser hochwertigen Reisemobile.'
        },
        service6: {
            title: 'Dometic Service',
            icon: 'bi-snow',
            content: 'Als autorisierter Dometic Service Provider kümmern wir uns um alle Dometic Geräte in Ihrem Fahrzeug. Ob Kühlschrank, Klimaanlage, Heizung, Toilette oder andere Dometic Produkte wir reparieren, warten und installieren diese Geräte fachgerecht. Wir haben Zugriff auf Original-Ersatzteile und Service-Dokumentationen. Unsere Techniker sind regelmäßig geschult und kennen die Dometic Produkte und deren Besonderheiten.'
        },
        service7: {
            title: 'PlanB Caravan Energy',
            icon: 'bi-clipboard-check',
            content: 'Hier stellen wir Ihnen in naher Zukunft unsere elektronischen Eigenmarken wie unsere Eigenmarke Lithium Batterien vor.'
        },
        service8: {
            title: 'Schnäppchenecke',
            icon: 'bi-tag-fill',
            content: 'In unserer Schnäppchenecke finden Sie Sonderpreise hochwertiger Zubehörteile aus unserem Abverkauf.'
        },
        service9: {
            title: 'Zubehör & Ersatzteile',
            icon: 'bi-box-seam',
            content: 'Wir führen ein umfangreiches Sortiment an Zubehör und Ersatzteilen von unseren Partnern. Von praktischem Reisezubehör über technische Komponenten bis hin zu Original-Ersatzteilen – bei uns finden Sie alles, was Sie für Ihr Reisemobil benötigen. Durch unsere langjährigen Partnerschaften mit namhaften Herstellern hochwertiger Produkte zu fairen Preisen. Gerne beraten wir Sie bei der Auswahl des passenden Zubehörs für Ihre individuellen Bedürfnisse.'
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
    
    // Partner Details Data
    const partnerDetails = {
        partner1: {
            name: 'Alde',
            logo: 'images/logos/alde.png',
            description: 'Alde ist ein führender Hersteller von Heizungs- und Warmwassersystemen für Reisemobile. Die schwedische Firma entwickelt innovative Flüssiggas- und Dieselheizungen, die für zuverlässige Wärme und Komfort auf Reisen sorgen. Alde-Systeme zeichnen sich durch ihre Energieeffizienz, leise Betriebsweise und innovative Technologie aus.',
            url: 'https://www.alde.se/'
        },
        partner2: {
            name: 'AL-KO-Sawiko',
            logo: 'images/logos/al-ko-sawiko.png',
            description: 'AL-KO-Sawiko ist ein bekannter Hersteller von Fahrwerkskomponenten und Zubehör für Wohnmobile. Das Unternehmen bietet hochwertige Achsen, Stabilisatoren, Stoßdämpfer und weitere Fahrwerkskomponenten, die für Sicherheit und Komfort beim Fahren sorgen. AL-KO-Produkte stehen für Qualität und Langlebigkeit.',
            url: 'https://www.al-ko.com/'
        },
        partner3: {
            name: 'Büttner Elektronik',
            logo: 'images/logos/buettner-elektronik.png',
            description: 'Büttner Elektronik entwickelt und produziert innovative elektronische Steuerungs- und Überwachungssysteme für Reisemobile. Die Firma bietet Lösungen für Batteriemanagement, Spannungsüberwachung, Solarregler und intelligente Steuerungssysteme, die den Komfort und die Energieeffizienz im Wohnmobil optimieren.',
            url: 'https://www.buettner-elektronik.de/'
        },
        partner4: {
            name: 'BullTron',
            logo: 'images/logos/bulltron.png',
            description: 'BullTron ist ein Spezialist für elektronische Steuerungssysteme und Sicherheitstechnik für Reisemobile. Das Unternehmen bietet innovative Lösungen für Alarmanlagen, Zentralverriegelungen, Fernbedienungen und intelligente Steuerungssysteme, die Sicherheit und Komfort im Wohnmobil erhöhen.',
            url: 'https://www.bulltron.de/'
        },
        partner5: {
            name: 'Clesana',
            logo: 'images/logos/clesana.avif',
            description: 'Clesana ist ein führender Hersteller von Sanitär- und Abwassersystemen für Reisemobile. Das Unternehmen bietet hochwertige Toiletten, Waschbecken, Duschkabinen und Abwassersysteme, die für Hygiene und Komfort auf Reisen sorgen. Clesana-Produkte zeichnen sich durch ihre Zuverlässigkeit und einfache Wartung aus.',
            url: 'https://www.clesana.com/'
        },
        partner6: {
            name: 'Eberspächer',
            logo: 'images/logos/eberspaecher.svg',
            description: 'Eberspächer ist ein weltweit führender Hersteller von Standheizungen und Abgassystemen für Fahrzeuge. Die Firma entwickelt innovative Diesel- und Benzinstandheizungen, die unabhängig vom Motor für Wärme sorgen. Eberspächer-Systeme sind bekannt für ihre Zuverlässigkeit, Effizienz und innovative Technologie.',
            url: 'https://www.eberspaecher.com/'
        },
        partner7: {
            name: 'Frankana/Freiko',
            logo: 'images/logos/frankana-freiko.png',
            description: 'Frankana/Freiko ist ein Spezialist für Fahrwerkskomponenten und Sicherheitstechnik für Reisemobile. Das Unternehmen bietet hochwertige Stabilisatoren, Kupplungen, Achsen und weitere Fahrwerkskomponenten, die für sicheres und komfortables Fahren sorgen. Die Produkte stehen für Qualität und Innovation.',
            url: 'https://www.frankana.de/'
        },
        partner8: {
            name: 'Linnepe',
            logo: 'images/logos/ep-hpc-linnepe.png',
            description: 'Linnepe ist ein Hersteller von hochwertigen Fahrwerkskomponenten und Zubehör für Reisemobile. Das Unternehmen bietet innovative Lösungen für Achsen, Stabilisatoren und weitere Fahrwerkskomponenten, die für Sicherheit und Komfort beim Fahren sorgen. Die Produkte zeichnen sich durch ihre Qualität und Langlebigkeit aus.',
            url: 'https://www.linnepe.eu/'
        },
        partner9: {
            name: 'Ten Haaft Oyster',
            logo: 'images/logos/ten-haaft-oyster.webp',
            description: 'Ten Haaft Oyster ist ein führender Hersteller von Satelliten- und Internetanlagen für Reisemobile. Das Unternehmen bietet innovative Lösungen für Satellitensysteme und Internetverbindungen, die für Unterhaltung und Kommunikation auf Reisen sorgen. Die Produkte zeichnen sich durch ihre Qualität, Zuverlässigkeit und einfache Installation aus.',
            url: 'https://www.ten-haaft.com/'
        },
        partner10: {
            name: 'IntelliRoute',
            logo: 'images/logos/intelliroute.png',
            description: 'IntelliRoute entwickelt intelligente Navigations- und Routenplanungssysteme speziell für Reisemobile. Das Unternehmen bietet Lösungen, die die spezifischen Anforderungen von Wohnmobilen berücksichtigen, wie Höhenbeschränkungen, Gewichtsbeschränkungen und Stellplatzsuche. Die Systeme helfen dabei, die optimale Route für Reisemobile zu finden.',
            url: 'https://www.intelliroute.eu/'
        },
        partner11: {
            name: 'SOG Systeme',
            logo: 'images/logos/sog-systeme.png',
            description: 'SOG Systeme ist ein Spezialist für Abwassersysteme und Sanitärtechnik für Reisemobile. Das Unternehmen bietet innovative Lösungen für Toiletten, Abwassersysteme und Sanitärkomponenten, die für Hygiene und Komfort sorgen. SOG-Produkte zeichnen sich durch ihre Zuverlässigkeit und einfache Wartung aus.',
            url: 'https://www.sog-systeme.de/'
        },
        partner12: {
            name: 'TELECO',
            logo: 'images/logos/teleco.png',
            description: 'TELECO ist ein führender Hersteller von Satelliten- und TV-Systemen für Reisemobile. Das Unternehmen bietet innovative Lösungen für Satellitenantennen, TV-Systeme und Multimedia-Komponenten, die für Unterhaltung und Information auf Reisen sorgen. TELECO-Produkte zeichnen sich durch ihre Qualität und einfache Installation aus.',
            url: 'https://www.telecogroup.com/'
        },
        partner13: {
            name: 'Thetford',
            logo: 'images/logos/thetford.png',
            description: 'Thetford ist ein weltweit führender Hersteller von Sanitär- und Kühlsystemen für Reisemobile. Das Unternehmen bietet hochwertige Toiletten, Kühlschränke, Herde und weitere Küchenkomponenten, die für Komfort und Hygiene auf Reisen sorgen. Thetford-Produkte sind bekannt für ihre Qualität, Zuverlässigkeit und innovative Technologie.',
            url: 'https://www.thetford.com/'
        },
        partner14: {
            name: 'THITRONIK',
            logo: 'images/logos/thitronik.svg',
            description: 'THITRONIK ist ein Spezialist für elektronische Steuerungs- und Überwachungssysteme für Reisemobile. Das Unternehmen bietet innovative Lösungen für Batteriemanagement, Spannungsüberwachung, Solarregler und intelligente Steuerungssysteme, die den Komfort und die Energieeffizienz im Wohnmobil optimieren. THITRONIK-Produkte zeichnen sich durch ihre Zuverlässigkeit und innovative Technologie aus.',
            url: 'https://www.thitronik.de/'
        }
    };
    
    // Partner Cards - No longer clickable, only show logos
    
    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.alt
    }));
    
    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Update lightbox image
    function updateLightboxImage() {
        if (images.length > 0 && currentImageIndex >= 0 && currentImageIndex < images.length) {
            lightboxImage.src = images[currentImageIndex].src;
            lightboxImage.alt = images[currentImageIndex].alt;
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
        }
    }
    
    // Show previous image
    function showPrevImage() {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        }
    }
    
    // Show next image
    function showNextImage() {
        if (images.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateLightboxImage();
        }
    }
    
    // Add click event to gallery images
    galleryItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Previous button
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }
    
    // Next button
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightboxImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightboxImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPrevImage();
            }
        }
    }
    
    // Gallery Toggle Functionality
    const galleryToggleBtn = document.getElementById('galleryToggleBtn');
    const galleryToggleIcon = document.getElementById('galleryToggleIcon');
    const galleryToggleText = document.getElementById('galleryToggleText');
    const hiddenGalleryItems = document.querySelectorAll('.gallery-item-hidden');
    
    let galleryExpanded = false;
    
    if (galleryToggleBtn && hiddenGalleryItems.length > 0) {
        galleryToggleBtn.addEventListener('click', function() {
            galleryExpanded = !galleryExpanded;
            
            hiddenGalleryItems.forEach((item, index) => {
                if (galleryExpanded) {
                    // Show with staggered animation
                    setTimeout(() => {
                        item.classList.add('show');
                    }, index * 30); // Small delay for each item
                } else {
                    // Hide immediately
                    item.classList.remove('show');
                }
            });
            
            // Update button text and icon
            if (galleryExpanded) {
                galleryToggleText.textContent = 'Weniger Bilder anzeigen';
                galleryToggleIcon.classList.remove('bi-chevron-down');
                galleryToggleIcon.classList.add('bi-chevron-up');
            } else {
                galleryToggleText.textContent = 'Mehr Bilder anzeigen';
                galleryToggleIcon.classList.remove('bi-chevron-up');
                galleryToggleIcon.classList.add('bi-chevron-down');
            }
        });
    }
});
