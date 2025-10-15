// Helper function to create optimized images (replace with your existing function if available)
function createOptimizedPicture(src, alt, lazy = false, sources = []) {
  const picture = document.createElement('picture');
  sources.forEach(source => {
    const sourceEl = document.createElement('source');
    sourceEl.setAttribute('srcset', source.url);
    sourceEl.setAttribute('media', source.media || '');
    picture.appendChild(sourceEl);
  });

  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.setAttribute('alt', alt);
  img.setAttribute('loading', lazy ? 'lazy' : 'eager');
  picture.appendChild(img);

  return picture;
}

export default function decorate(block) {
  const testimonials = [
    {
      name: "Mr. Niranjan Vaidya",
      position: "Head - Information Technology, Bajaj AMC",
      testimonial: "After working with Bajaj Technology Services on numerous projects across the span of around 2 years, I can confidently say the collaboration has been incredibly enriching. Bajaj Technology Services truly delivers on its promise of the right balance between experience and technical skill.",
      imgSrc: "./media_1e868b3d8ce8cc2fc87826bfeb34f3de314210238.png"
    },
    {
      name: "Mr. Moahit Mittal",
      position: "Business Head, Bajaj Finserv Ltd.",
      testimonial: "Bajaj Technology Services team has profoundly understood our business needs and challenges. Their innovative solutions have streamlined our operations and boosted efficiency. They are a true partner, dedicated to our success, and we look forward to exploring new collaboration opportunities.",
      imgSrc: "./media_1c41c5f18ff06896180d7cc0e8168fd88d14b77e1.png"
    },
    {
      name: "Mr. Vikash Kumar",
      position: "IT Head, Bajaj Finserv Ltd.",
      testimonial: "The e-commerce platform uptime metrics were met through the year and cross-sell has increased. The same platform for consumer durables was seamlessly extended to create a marketplace for two-wheeler and four-wheeler businesses as well. Kudos to the Bajaj Technology Services team.",
      imgSrc: "./media_12d837ba287174eca852a529ee9aa2371740d8854.png"
    }
  ];

  const clientTestimonialsWrapper = document.createElement('div');
  clientTestimonialsWrapper.classList.add('scroll-outer');

  const scrollableSections = document.createElement('div');
  scrollableSections.classList.add('scrollable-sections');

  testimonials.forEach(testimonial => {
    const clientData = document.createElement('div');
    clientData.classList.add('clientdata');

    // Add image
    const clientImgOuter = document.createElement('div');
    clientImgOuter.classList.add('clientimgouter');
    const picture = createOptimizedPicture(testimonial.imgSrc, testimonial.name, true, [
      { url: testimonial.imgSrc, media: "(min-width: 600px)" }
    ]);
    clientImgOuter.appendChild(picture);
    clientData.appendChild(clientImgOuter);

    // Add name and position
    const namePos = document.createElement('div');
    namePos.classList.add('name-pos');
    const name = document.createElement('div');
    name.classList.add('name-pos-name');
    name.textContent = testimonial.name;
    const position = document.createElement('div');
    position.classList.add('name-pos-pos');
    position.textContent = testimonial.position;
    namePos.appendChild(name);
    namePos.appendChild(position);
    clientData.appendChild(namePos);

    // Add testimonial text
    const opOuter = document.createElement('div');
    opOuter.classList.add('op-outer');
    const svgOuter = document.createElement('div');
    svgOuter.classList.add('svg-outer');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '18');
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('fill', '#F50');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('d', "M5.238 4.09c.45-.1.91-.152 1.37-.151 3.65 0 6.607 3.148 6.607 7.03S10.257 18 6.608 18 0 14.853 0 10.969q0-.172.008-.342H0C0 4.767 4.48 0 9.987 0v2.36c-1.787 0-3.434.647-4.749 1.73m14.787 0q.662-.15 1.367-.151c3.65 0 6.608 3.148 6.608 7.03S25.041 18 21.392 18c-3.65 0-6.607-3.147-6.607-7.031q0-.172.008-.342h-.008C14.785 4.767 19.265 0 24.772 0v2.36c-1.787 0-3.432.647-4.747 1.73");
    svg.appendChild(path);
    svgOuter.appendChild(svg);
    opOuter.appendChild(svgOuter);

    const op = document.createElement('div');
    op.classList.add('op');
    const opText = document.createElement('span');
    opText.textContent = testimonial.testimonial;
    op.appendChild(opText);
    opOuter.appendChild(op);
    clientData.appendChild(opOuter);

    scrollableSections.appendChild(clientData);
  });

  clientTestimonialsWrapper.appendChild(scrollableSections);
  block.replaceChildren(clientTestimonialsWrapper);
}
