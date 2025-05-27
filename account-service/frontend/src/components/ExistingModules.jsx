import { useEffect } from 'react';


export default function ExistingModules() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);


  return (
    <div>
      <div className="apps-modules">
        <a href="http://127.0.0.1:8001/form_config/" className="link">
          <i className="material-icons" style={{ verticalAlign: 'middle', marginRight: '8px' }}>front_hand</i>
          Перейти к упражнениям!
        </a>
      </div>
    </div>
  );
}