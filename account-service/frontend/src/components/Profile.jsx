import React, { useEffect, useState } from 'react';
import { getUser } from '../api';
import ExistingModules from './ExistingModules';
import {
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'

export default function Profile({ token, onLogout }) {
  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false)

  document.title = "Домашняя страница"

  useEffect(() => {
    getUser()
      .then(res => setUser(res.data))
      .catch(err => {
        console.error(err);
      });
  }, []);

  if (!user) return <div>Загрузка...</div>;
  
  return (
    <>
    <div>
      <CNavbar expand="lg" className="bg-body-tertiary">
        <CContainer fluid>
          <CNavbarBrand href={"/profile"}>Твоя моторика</CNavbarBrand>
          <CNavbarToggler
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav>
            <CNavItem>
                <CNavLink href="#" active >{user.username}</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#" >Инфо</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink onClick={onLogout} active> Выход </CNavLink>
              </CNavItem>
            </CNavbarNav>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </div>
    <div>
      
      <ExistingModules />
      
    </div>
    </>
    );
}