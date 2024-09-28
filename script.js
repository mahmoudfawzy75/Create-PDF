const { jsPDF } = window.jspdf;

// Handle image upload and display
document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const imagePreview = document.getElementById('imagePreview');
    const selectAllContainer = document.getElementById('selectAllContainer');
    
    imagePreview.innerHTML = '';

    // Display "Choose All" checkbox only if more than 2 images are selected
    if (files.length > 2) {
        selectAllContainer.style.display = 'block';
    } else {
        selectAllContainer.style.display = 'none';
    }

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const div = document.createElement('div');
            div.className = 'image-item';

            const img = document.createElement('img');
            img.src = event.target.result;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'imageCheckbox';
            checkbox.id = `checkbox${index}`;
            checkbox.value = event.target.result;

            const label = document.createElement('label');
            label.htmlFor = `checkbox${index}`;
            label.innerText = 'Include';

            div.appendChild(img);
            div.appendChild(checkbox);
            div.appendChild(label);
            imagePreview.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
});

// Handle "Choose All" checkbox functionality
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.imageCheckbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Convert selected images to PDF
document.getElementById('convertButton').addEventListener('click', () => {
    const pdf = new jsPDF();
    const selectedImages = Array.from(document.querySelectorAll('input.imageCheckbox:checked'));
    
    if (selectedImages.length === 0) {
        alert('Please select at least one image!');
        return;
    }

    const pdfNameInput = document.getElementById('pdfName').value;
    const pdfFileName = pdfNameInput ? pdfNameInput : 'selected-images';

    let margin = 10;

    selectedImages.forEach((checkbox, index) => {
        const img = new Image();
        img.src = checkbox.value;
        img.onload = function() {
            const width = pdf.internal.pageSize.getWidth() - margin * 2;
            const height = (img.height / img.width) * width;

            if (index > 0) pdf.addPage();
            pdf.addImage(img, 'PNG', margin, margin, width, height);

            if (index === selectedImages.length - 1) {
                pdf.save(`${pdfFileName}.pdf`);
            }
        };
    });
});
