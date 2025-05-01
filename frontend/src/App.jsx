import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import React from 'react'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
    </Routes>

    </BrowserRouter>
  )
}

export default App

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={Login}>
//           {/* <Route index element={<Home />} /> */}
//           {/* <Route path="blogs" element={<Blogs />} />
//           <Route path="contact" element={<Contact />} /> */}
//           {/* <Route path="*" element={<NoPage />} /> */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

