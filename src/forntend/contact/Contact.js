import React, { useState } from 'react';
import HomeHeader from '../HomeHeader';
import Footer from '../Footer';
import { toast } from 'react-toastify';
import ContactServices from '../../services/conatctServices'; // Make sure this path is correct

const Contact = () => {
   const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      mobileno: '',
      description: ''
   });

   const [message, setMessage] = useState('');

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();



      try {
         const res = await ContactServices.createContact({
            ...formData,

         });

         toast.success('Your message has been sent successfully!');
      } catch (err) {
         const errorMsg = err.response?.data?.message || 'Something went wrong.';
         toast.error(errorMsg);

      }
   };

   return (
      <>
         <HomeHeader />
         <section className="ec-page-content section-space-p">
            <div className="container">
               <div className="row">
                  <div className="ec-common-wrapper">
                     <div className="ec-contact-leftside">
                        <div className="ec-contact-container">
                           <div className="ec-contact-form">
                              <form onSubmit={handleSubmit}>
                                 <span className="ec-contact-wrap">
                                    <label>First Name*</label>
                                    <input
                                       type="text"
                                       name="first_name"
                                       placeholder="Enter your first name"
                                       value={formData.first_name}
                                       onChange={handleChange}
                                       required
                                    />
                                 </span>
                                 <span className="ec-contact-wrap">
                                    <label>Last Name*</label>
                                    <input
                                       type="text"
                                       name="last_name"
                                       placeholder="Enter your last name"
                                       value={formData.last_name}
                                       onChange={handleChange}
                                       required
                                    />
                                 </span>
                                 <span className="ec-contact-wrap">
                                    <label>Email*</label>
                                    <input
                                       type="email"
                                       name="email"
                                       placeholder="Enter your email address"
                                       value={formData.email}
                                       onChange={handleChange}
                                       required
                                    />
                                 </span>
                                 <span className="ec-contact-wrap">
                                    <label>Phone Number*</label>
                                    <input
                                       type="text"
                                       name="mobileno"
                                       placeholder="Enter your phone number"
                                       value={formData.mobileno}
                                       onChange={handleChange}
                                       required
                                    />
                                 </span>
                                 <span className="ec-contact-wrap">
                                    <label>Comments/Questions*</label>
                                    <textarea
                                       name="description"
                                       placeholder="Please leave your comments here..."
                                       value={formData.description}
                                       onChange={handleChange}
                                       required
                                    />
                                 </span>
                                 <span className="ec-contact-wrap ec-contact-btn">
                                    <button className="btn btn-primary" type="submit">
                                       Submit
                                    </button>
                                 </span>
                              </form>
                           </div>
                        </div>
                     </div>
                     <div className="ec-contact-rightside">
                        <div className="ec_contact_map">
                           <div className="ec_map_canvas">
                              <iframe
                                 id="ec_map_canvas"
                                 title="Contact Location"
                                 width="100%"
                                 height="300"
                                 frameBorder="0"
                                 src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d71263.65594328841!2d144.93151478652146!3d-37.8734290780509!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1615963387757!5m2!1sen!2sus"
                                 allowFullScreen
                              />
                           </div>
                        </div>
                        <div className="ec_contact_info">
                           <h1 className="ec_contact_info_head pt-3 pl-2">Contact us</h1>
                           <ul className="align-items-center">
                              <li className="ec-contact-item ">
                                 <i className="fas fa-map-marker-alt ml-2" />
                                 <span>Address:</span> 71 Pilgrim Avenue, Chevy Chase, East California, MD 20815, USA
                              </li>
                              <li className="ec-contact-item align-items-center">
                                 <i className="fas fa-phone ml-2" />
                                 <span>Call Us:</span>
                                 <a href="tel:+91 5241234589">+91 5241234589</a>
                              </li>
                              <li className="ec-contact-item align-items-center ">
                                 <i className="fas fa-envelope ml-2" />{" "}
                                 <span>Email:</span>
                                 <a href="mailto:example@ec-email.com"> example123@gmail.com</a>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
         <Footer />
      </>
   );
};

export default Contact;
