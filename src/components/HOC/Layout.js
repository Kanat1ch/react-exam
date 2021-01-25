import React from 'react';
import {NavLink} from "react-router-dom";
import {Router} from "./Router";

export const Layout = () => {
  return (
      <div className={'Layout'}>
          <div className="Layout__nav">
              <div className="Layout__nav_logo">
                  <h1>Kanatnikov1019</h1>
              </div>
              <div className="Layout__nav_menu">
                  <ul>
                      <li>
                          <NavLink to={'/'} exact>
                              Главная
                          </NavLink>
                      </li>
                      <li>
                          <NavLink to={'/info'}>
                              Информация
                          </NavLink>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="Layout__content">
              <Router />
          </div>
          <div className="Layout__footer">
              <h2>Канатников Илья, 191-321</h2>
              <a href="https://github.com/Kanat1ch/react-exam">GitHub</a>
          </div>
      </div>
  )
};