// import React, { useEffect, useState } from "react";
// import Header from "../../common/Header";
// import Footer from "../../common/Footer";
// import Sidebar from "../../common/Sidebar";
// import { Link } from "react-router-dom";
// import { apiUrl, token } from "../../common/http";
// import { toast } from "react-toastify";

// const Show = () => {
//   const [services, setServices] = useState([]);

//   const fetchServices = async () => {
//     const res = await fetch(apiUrl + "services", {
//       method: "GET",
//       headers: {
//         "Content-type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${token()}`,
//       },
//     });

//     const result = await res.json();
//     setServices(result.data);
//   };

//   const deleteService = async (id) => {
//     if (confirm("Are  you sure you want to delete?")) {
//       const res = await fetch(apiUrl + "services/" + id, {
//         method: "DELETE",
//         headers: {
//           "Content-type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${token()}`,
//         },
//       });
//       const result = await res.json();
//       if (result.status == true) {
//         {
//           const newServices = services.filter((service) => service.id != id);
//           setServices(newServices);
//           toast.success(result.message, {
//             position: "top-right",
//           });
//         }
//       } else {
//         toast.success(result.message, {
//           position: "top-center",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   return (
//     <>
//       <Header />
//       <main>
//         <div className="container my-5">
//           <div className="row">
//             <div className="col-md-3">
//               {/* Sidebar */}
//               <Sidebar />
//             </div>
//             <div className="col-md-9">
//               {/* Dashboard */}
//               <div className="card shadow border-0">
//                 <div className="card-body p-4">
//                   <div className="d-flex justify-content-between">
//                     <h4 className="h5">Services</h4>
//                     <Link
//                       to="/admin/services/create"
//                       className="btn btn-primary"
//                     >
//                       Create
//                     </Link>
//                   </div>
//                   <hr />

//                   <table className="table table-striped">
//                     <thead>
//                       <tr>
//                         <th>ID</th>
//                         <th>Name</th>
//                         <th>Slug</th>
//                         <th>Status</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {services &&
//                         services.map((service) => {
//                           return (
//                             <tr key={`service-${service.id}`}>
//                               <td>{service.id}</td>
//                               <td>{service.title}</td>
//                               <td>{service.slug}</td>
//                               <td>
//                                 {service.status == 1 ? "Active" : "Block"}
//                               </td>
//                               <td>
//                                 <Link
//                                   to={`/admin/services/edit/${service.id}`}
//                                   className="btn btn-primary btn-sm"
//                                 >
//                                   Edit
//                                 </Link>
//                                 <button
//                                   onClick={() => deleteService(service.id)}
//                                   className="btn btn-danger btn-sm ms-2"
//                                 >
//                                   Delete
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default Show;
import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { apiUrl, token } from "../../common/http";
import { toast } from "react-toastify";

// Modal component for delete confirmation
const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete?</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Show = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl + "services", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      setServices(result.data);
    } catch (error) {
      toast.error("Failed to fetch services", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await fetch(apiUrl + "services/" + id, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();
      if (result.status === true) {
        setServices(services.filter((service) => service.id !== id));
        toast.success(result.message, {
          position: "top-right",
        });
      } else {
        toast.error(result.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Failed to delete service", {
        position: "top-right",
      });
    }
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedService) {
      deleteService(selectedService.id);
      setModalOpen(false);
      setSelectedService(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <Header />
      <main>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3">
              <Sidebar />
            </div>
            <div className="col-md-9">
              <div className="card shadow border-0">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between">
                    <h4 className="h5">Services</h4>
                    <Link
                      to="/admin/services/create"
                      className="btn btn-primary"
                    >
                      Create
                    </Link>
                  </div>
                  <hr />
                   {loading ? (
                    <div className="text-center">
                      <div className="spinner-border" style={{ color: '#fe538d' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Slug</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services &&
                          services.map((service) => (
                            <tr key={`service-${service.id}`}>
                              <td>{service.id}</td>
                              <td>{service.title}</td>
                              <td>{service.slug}</td>
                              <td>
                                {service.status === 1 ? "Active" : "Block"}
                              </td>
                              <td>
                                <Link
                                  to={`/admin/services/edit/${service.id}`}
                                  className="btn btn-primary btn-sm"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteClick(service)}
                                  className="btn btn-danger btn-sm ms-2"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <DeleteModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Show;
