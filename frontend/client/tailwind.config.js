/** @type {import('tailwindcss').Config} */
// const Nth =  require('tailwindcss-nth-child');
// const plugin =  new  Nth()
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      '4xl': '1.5rem',
      '5xl': "2rem",
      '6xl': '2.5rem',
      '7xl':  '3rem',
      '8xl': '3.5rem',
      '9xl': '10rem',
    },
    extend: {
      backgroundColor:{
        'black-t-50': 'rgba(0,0,0,0.5)'
      },
      textColor:{
        'bright-yellow': "#ffff00",
        'bright-red':    "#ff0000"
      },
      backgroundImage:{
        // template "url('')",
        'blue-triangles':     "url('https://img.freepik.com/free-vector/abstract-blue-geometric-shapes-background_1035-17545.jpg?w=740&t=st=1668965518~exp=1668966118~hmac=6b5258099db85fe3dc3aaee8d588407e4a3a3bcc406fbfd741765aae367a4030')",
        'blue-cement':        "url('https://img.freepik.com/free-photo/abstract-grunge-decorative-relief-navy-blue-stucco-wall-texture-wide-angle-rough-colored-background_1258-28311.jpg?w=740&t=st=1668967596~exp=1668968196~hmac=7553db8c5809c4ba878a5f87e16febf16799a4659827d904b13befe111cf9915')",
        'blue-low-poly':      "url('https://img.freepik.com/free-vector/modern-banner-with-abstract-low-poly-design_1048-14340.jpg?w=740&t=st=1668967736~exp=1668968336~hmac=c8888dd1df7b328a77239ada00a8504f2eb753a17656417b2f3862886ea90634')", 
        'abstract-wave':      "url('https://img.freepik.com/free-vector/abstract-colorful-technology-dotted-wave-background_1035-17450.jpg?w=740&t=st=1668968767~exp=1668969367~hmac=ac06b8629cc4f6c53a41544e317a04e72a70d8bdf0cbf33d588698a0064ac201')",
        'digital-mesh':       "url('https://img.freepik.com/free-vector/abstract-banner-with-modern-cyber-particles-design_1048-14381.jpg?t=st=1668962359~exp=1668962959~hmac=a623a2daaead806db39eca37ffa79b7d39549f941495b31c70d3920cf3ef9638')",    
        'neon-suits':         "url('https://img.freepik.com/free-vector/neon-symbols-casino-playing-cards-background_1017-23680.jpg?w=740&t=st=1668969112~exp=1668969712~hmac=85d759f6833d4cc1a5a0c1762908425d72123bd01a7566796a8d0e02f86b00ad')",
        'card-circle':        "url('https://images.pexels.com/photos/2508565/pexels-photo-2508565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        'low-poly-mountain':  "url('https://wallpapercave.com/dwp1x/wp1902565.jpg')",
        'poker-table':        "url('https://img.freepik.com/premium-vector/poker-table-background-green-color_47243-1067.jpg?w=740')",
      }

    },
      component: {
      'hand': {
        "nth-child(1)": "left: 0;",
        "nth-child(2)": "left: 1.1em;",
      }
    }
  },
  // plugins: [ plugin.nthChild()],
}


