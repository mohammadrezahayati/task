import { API, fetchFormStructure, submitApplication } from '@/utils/network';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useTheme } from './context/createTheme';

const DynamicForm = () => {
  const { theme } = useTheme();
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [formData, setFormData] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState({});
  const [visibleFields, setVisibleFields] = useState({});
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const {
    data: insuranceForms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['formStructure'],
    queryFn: fetchFormStructure,
  });

  useEffect(() => {
    // Load saved form data from local storage on mount
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);

  useEffect(() => {
    if (formData) {
      // Auto-save form data to local storage every 5 seconds
      const autoSaveInterval = setInterval(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
      }, 5000);

      return () => {
        clearInterval(autoSaveInterval); // Clean up on component unmount
      };
    }
  }, [formData]);

  const handleInsuranceSelect = (e) => {
    setSelectedInsurance(e.target.value);
    setFormData({});
    setDynamicOptions({});
    setVisibleFields({});
  };

  const fetchStatesForCountry = async (country) => {
    try {
      const response = await API({
        url: `https://assignment.devotel.io/api/getStates?country=${country}`,
        method: 'GET',
      });

      if (response.data?.states) {
        setDynamicOptions((prevState) => ({
          ...prevState,
          state: response.data.states,
        }));
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  useEffect(() => {
    if (country) {
      fetchStatesForCountry(country);
    }
  }, [country]);

  const updateVisibility = (updatedFormData) => {
    const newVisibility = {};
    insuranceForms?.forEach((form) => {
      form.fields.forEach((field) => {
        if (field.fields) {
          field.fields.forEach((nestedField) => {
            if (nestedField.visibility) {
              const {
                dependsOn,
                condition,
                value: visibilityValue,
              } = nestedField.visibility;
              const fieldValue = updatedFormData[dependsOn];
              let isVisible = false;

              if (condition === 'equals' && fieldValue === visibilityValue) {
                isVisible = true;
              } else if (
                condition === 'not_equals' &&
                fieldValue !== visibilityValue
              ) {
                isVisible = true;
              }

              newVisibility[nestedField.id] = isVisible;
            } else {
              newVisibility[nestedField.id] = true;
            }
          });
        }
      });
    });
    setVisibleFields(newVisibility);
  };

  const handleFieldChange = (fieldId, value) => {
    if (fieldId === 'country') {
      setCountry(value);
    }
    setFormData((prevData) => {
      const updatedFormData = { ...prevData, [fieldId]: value };
      updateVisibility(updatedFormData);
      return updatedFormData;
    });

    const field = getFieldById(fieldId);
    if (field?.dynamicOptions) {
      const { dependsOn, endpoint, method } = field.dynamicOptions;
      if (dependsOn && formData[dependsOn] !== undefined) {
        fetchStatesForCountry(formData[dependsOn]);
      }
    }
  };

  const getFieldById = (fieldId) => {
    return insuranceForms
      .flatMap((form) => form.fields)
      .find((field) => field.id === fieldId);
  };

  const selectedForm = insuranceForms?.find(
    (form) => form.formId === selectedInsurance
  );

  useEffect(() => {
    if (country) {
      fetchStatesForCountry(country);
    }
  }, [country]);

  useEffect(() => {
    if (insuranceForms && formData) {
      updateVisibility(formData);
    }
  }, [insuranceForms, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await submitApplication(formData);
      toast.success('Hooraay you done it!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
      });
      localStorage.removeItem('formData'); // Clear saved form data after submit
      console.log('Form submitted successfully:', response);
    } catch (error) {
      toast.error('Ooops Error Happen!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
        transition: Bounce,
      });
      console.error('Error submitting the form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching form data!</div>;

  const formContainerStyle =
    theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';
  const formGroupStyle =
    theme === 'dark'
      ? 'bg-gray-800 p-4 rounded-md'
      : 'bg-gray-100 p-4 rounded-md';
  const inputStyle =
    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black';
  const buttonStyle =
    theme === 'dark'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div
      className={`form-container ${formContainerStyle} p-6 rounded-lg shadow-lg`}>
      <h2 className='text-xl font-semibold mb-4'>Select Insurance Type</h2>

      <select
        onChange={handleInsuranceSelect}
        value={selectedInsurance}
        className={`${inputStyle} p-2 mb-4 rounded-md w-full`}>
        <option value=''>Select Insurance Type</option>
        {insuranceForms?.map((item) => (
          <option key={item.formId} value={item.formId}>
            {item.title}
          </option>
        ))}
      </select>

      {selectedInsurance && selectedForm && (
        <form onSubmit={handleSubmit}>
          <h3 className='text-2xl font-semibold mb-4'>{selectedForm.title}</h3>
          {selectedForm.fields.map((group) =>
            group.type === 'group' ? (
              <div key={group.id} className={formGroupStyle}>
                <h4 className='font-semibold text-lg mb-2'>{group.label}</h4>
                {group.fields.map((field) => {
                  const isVisible = visibleFields[field.id] !== false;

                  if (isVisible) {
                    return (
                      <div key={field.id} className='mb-4'>
                        <label className='block mb-2 font-medium'>
                          {field.label}
                        </label>
                        {field.type === 'text' ||
                        field.type === 'number' ||
                        field.type === 'date' ? (
                          <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            required={field.required}
                            className={`${inputStyle} p-2 rounded-md w-full`}
                          />
                        ) : null}

                        {field.type === 'select' && (
                          <select
                            value={formData[field.id] || ''}
                            onChange={(e) =>
                              handleFieldChange(field.id, e.target.value)
                            }
                            required={field.required}
                            className={`${inputStyle} p-2 rounded-md w-full`}>
                            <option value=''>{field.label}</option>
                            {(dynamicOptions[field.id] || field.options)?.map(
                              (option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              )
                            )}
                          </select>
                        )}

                        {field.type === 'radio' && (
                          <div className='flex items-center space-x-4'>
                            {field.options.map((option) => (
                              <div key={option} className='flex items-center'>
                                <input
                                  type='radio'
                                  id={`${field.id}_${option}`}
                                  name={field.id}
                                  value={option}
                                  checked={formData[field.id] === option}
                                  onChange={(e) =>
                                    handleFieldChange(field.id, e.target.value)
                                  }
                                  required={field.required}
                                  className='mr-2'
                                />
                                <label htmlFor={`${field.id}_${option}`}>
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}

                        {field.type === 'checkbox' && (
                          <div className='flex items-center space-x-4'>
                            {field.options.map((option) => (
                              <div key={option} className='flex items-center'>
                                <input
                                  type='checkbox'
                                  id={`${field.id}_${option}`}
                                  name={field.id}
                                  checked={formData[field.id]?.includes(option)}
                                  onChange={(e) => {
                                    const newData = { ...formData };
                                    if (e.target.checked) {
                                      newData[field.id] = [
                                        ...(newData[field.id] || []),
                                        option,
                                      ];
                                    } else {
                                      newData[field.id] = newData[
                                        field.id
                                      ].filter((item) => item !== option);
                                    }
                                    handleFieldChange(
                                      field.id,
                                      newData[field.id]
                                    );
                                  }}
                                  required={field.required}
                                  className='mr-2'
                                />
                                <label htmlFor={`${field.id}_${option}`}>
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : null
          )}
          <button
            type='submit'
            className={`${buttonStyle} p-2 rounded-md text-white w-full mt-4`}
            disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default DynamicForm;
