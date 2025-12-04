import b1Img from '../assets/b1.png';
import b2Img from '../assets/b2.png';
import b3Img from '../assets/b3.png';
import b4Img from '../assets/b4.png';

export function createBrochuresPage() {
    const page = document.createElement('div');
    page.className = 'brochures-page';
    page.style.display = 'none';
    
    const brochures = [
        { img: b1Img, link: 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:b50e15bc-def6-412c-881c-f3a16fe51195?x_api_client_id=edge_extension_viewer&x_api_client_location=share&locale=en-US&theme=light&page_theme=light' },
        { img: b2Img, link: 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:0d7f4189-3391-4c1f-9e0f-917f51265923' },
        { img: b3Img, link: 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:58db68e7-e491-4e95-a208-053998f64918?viewer%21megaVerb=group-discover' },
        { img: b4Img, link: 'https://acrobat.adobe.com/id/urn:aaid:sc:eu:4e182555-7573-4e7e-93c1-a9d24cd671f1?viewer%21megaVerb=group-discover' }
    ];
    
    page.innerHTML = `
        <div class="brochures-container">
            <button class="close-brochures-btn" id="closeBrochures">✕</button>
            <h1>Brochures</h1>
            <div class="brochures-grid">
                ${brochures.map((b, i) => `
                    <a href="${b.link}" target="_blank" class="brochure-card">
                        <img src="${b.img}" alt="Brochure ${i + 1}">
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    
    page.querySelector('#closeBrochures').onclick = () => {
        page.style.display = 'none';
    };
    
    page.show = () => {
        page.style.display = 'flex';
    };
    
    return page;
}
