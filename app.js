// =========================================================
// CONECTADOS 2027
// JavaScript del formulario de inscripción
// =========================================================


// =========================================================
// CONFIGURACIÓN
// =========================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbx3Uf4V1HjX5tEV5IaQfFJ3iu-oTSFVnfhJ4z62Ezd4N1_Le0YyHa33YX_ftlFlhGJ9/exec";


// =========================================================
// ELEMENTOS
// =========================================================

const registrationForm =
  document.querySelector("#registration-form");

const formMessage =
  document.querySelector("#form-message");

const menuToggle =
  document.querySelector(".menu-toggle");

const nav =
  document.querySelector(".nav");

const birthDate =
  registrationForm.elements.birthDate;

const ageResult =
  document.querySelector("#age-result");

const guardianSection =
  document.querySelector("#guardian-section");

const guardianAcceptanceRow =
  document.querySelector("#guardian-acceptance-row");

const guardianAccepts =
  registrationForm.elements.guardianAccepts;

const submitButton =
  registrationForm.querySelector(
    'button[type="submit"]'
  );


// =========================================================
// COMPROBAR ELEMENTOS
// =========================================================

console.log("CONECTADOS 2027 - app.js cargado");

console.log("API:", API_URL);

console.log(
  "Formulario:",
  registrationForm ? "OK" : "ERROR"
);

console.log(
  "Fecha nacimiento:",
  birthDate ? "OK" : "ERROR"
);

console.log(
  "Resultado edad:",
  ageResult ? "OK" : "ERROR"
);

console.log(
  "Responsable:",
  guardianSection ? "OK" : "ERROR"
);


// =========================================================
// MENÚ
// =========================================================

if (menuToggle && nav) {

  menuToggle.addEventListener("click", () => {

    const isOpen =
      nav.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Cerrar menú"
        : "Abrir menú"
    );

  });


  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}


// =========================================================
// CALCULAR EDAD
// =========================================================

function calculateAge(value) {

  if (!value) {
    return null;
  }

  const parts =
    value.split("-").map(Number);

  if (parts.length !== 3) {
    return null;
  }

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (
    !year ||
    !month ||
    !day
  ) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() - year;

  const birthdayThisYear =
    new Date(
      today.getFullYear(),
      month - 1,
      day
    );

  if (
    today <
    birthdayThisYear
  ) {
    age--;
  }

  return age;
}


// =========================================================
// ACTUALIZAR EDAD
// =========================================================

function updateAge() {

  const age =
    calculateAge(
      birthDate.value
    );


  console.log(
    "Fecha:",
    birthDate.value,
    "Edad:",
    age
  );


  // -------------------------------------------------------
  // SIN FECHA
  // -------------------------------------------------------

  if (age === null) {

    ageResult.textContent =
      "La edad se calculará con la fecha de nacimiento.";

    ageResult.classList.remove(
      "age-error"
    );


    birthDate.setCustomValidity("");


    // Ocultar responsable

    if (guardianSection) {
      guardianSection.hidden = true;
    }

    if (guardianAcceptanceRow) {
      guardianAcceptanceRow.hidden = true;
    }

    guardianAccepts.required = false;

    guardianAccepts.checked = false;

    return;
  }


  // -------------------------------------------------------
  // EDAD MENOR A 11
  // -------------------------------------------------------

  if (age < 11) {

    ageResult.textContent =
      "La edad mínima para participar es de 11 años.";

    ageResult.classList.add(
      "age-error"
    );


    birthDate.setCustomValidity(
      "La edad mínima para inscribirse es de 11 años."
    );


    if (guardianSection) {
      guardianSection.hidden = true;
    }

    if (guardianAcceptanceRow) {
      guardianAcceptanceRow.hidden = true;
    }

    guardianAccepts.required = false;

    guardianAccepts.checked = false;

    return;
  }


  // -------------------------------------------------------
  // EDAD VÁLIDA
  // -------------------------------------------------------

  birthDate.setCustomValidity("");


  ageResult.textContent =
    `Edad calculada: ${age} años.`;

  ageResult.classList.remove(
    "age-error"
  );


  // -------------------------------------------------------
  // MENOR DE 18
  // -------------------------------------------------------

  if (age < 18) {

    console.log(
      "Participante menor de edad"
    );


    if (guardianSection) {
      guardianSection.hidden = false;
    }

    if (guardianAcceptanceRow) {
      guardianAcceptanceRow.hidden = false;
    }

    guardianAccepts.required = true;

    return;
  }


  // -------------------------------------------------------
  // MAYOR O IGUAL A 18
  // -------------------------------------------------------

  console.log(
    "Participante mayor de edad"
  );


  if (guardianSection) {
    guardianSection.hidden = true;
  }

  if (guardianAcceptanceRow) {
    guardianAcceptanceRow.hidden = true;
  }

  guardianAccepts.required = false;

  guardianAccepts.checked = false;

}


// =========================================================
// FECHA MÁXIMA = HOY
// =========================================================

const today =
  new Date();

birthDate.max =
  `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;


// =========================================================
// EVENTOS DE FECHA
// =========================================================

birthDate.addEventListener(
  "input",
  updateAge
);

birthDate.addEventListener(
  "change",
  updateAge
);


// =========================================================
// CAMPOS CONDICIONALES
// =========================================================

document
  .querySelectorAll(
    "[data-conditional]"
  )
  .forEach(select => {

    const target =
      document.getElementById(
        select.dataset.conditional
      );


    if (!target) {
      return;
    }


    const dependentInput =
      target.querySelector(
        "[data-required-when-visible]"
      );


    const updateConditional = () => {

      const show =
        select.value === "yes" ||
        select.value === "Otro";


      target.hidden =
        !show;


      if (dependentInput) {

        dependentInput.required =
          show;


        if (!show) {
          dependentInput.value = "";
        }

      }

    };


    select.addEventListener(
      "change",
      updateConditional
    );


    updateConditional();

  });


// =========================================================
// ENVÍO DEL FORMULARIO
// =========================================================

registrationForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    console.log(
      "Inicio envío formulario"
    );


    // Actualizar edad

    updateAge();


    // Limpiar mensaje

    formMessage.className =
      "form-message";

    formMessage.textContent =
      "";


    // Validar

    if (
      !registrationForm.reportValidity()
    ) {

      formMessage.textContent =
        "Revisá los campos obligatorios, la edad y las aceptaciones requeridas.";

      formMessage.classList.add(
        "error"
      );

      formMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      return;
    }


    // =====================================================
    // OBTENER DATOS
    // =====================================================

    const data =
      Object.fromEntries(
        new FormData(
          registrationForm
        ).entries()
      );


    // Edad

    data.age =
      calculateAge(
        data.birthDate
      );


    // Responsable

    data.guardianAccepts =
      guardianAccepts.checked;


    // Estados

    data.registrationStatus =
      "registrada";

    data.paymentStatus =
      "pendiente";


    console.log(
      "Datos a enviar:",
      data
    );


    // =====================================================
    // BOTÓN
    // =====================================================

    const originalText =
      submitButton.innerHTML;


    submitButton.disabled =
      true;


    submitButton.innerHTML =
      "Enviando inscripción...";


    formMessage.textContent =
      "Enviando datos...";

    formMessage.classList.add(
      "success"
    );


    // =====================================================
    // ENVIAR A APPS SCRIPT
    // =====================================================

    try {

      console.log(
        "Enviando a:",
        API_URL
      );


      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(data)
          }
        );


      console.log(
        "Respuesta HTTP:",
        response.status
      );


      const text =
        await response.text();


      console.log(
        "Respuesta Apps Script:",
        text
      );


      let result;

      try {

        result =
          JSON.parse(text);

      } catch (jsonError) {

        throw new Error(
          "Apps Script no devolvió un JSON válido: " +
          text
        );

      }


      // ===================================================
      // ERROR DEVUELTO POR APPS SCRIPT
      // ===================================================

      if (!result.ok) {

        throw new Error(
          result.error ||
          "Apps Script rechazó la inscripción."
        );

      }


// ===================================================
// ÉXITO
// ===================================================

const idParticipante =
  result.id || "pendiente";

const qrContenido =
  result.qr || result.id || "";

const estado =
  result.estado || "";

const numeroListaEspera =
  result.numeroListaEspera || "";


// ===================================================
// MOSTRAR RESULTADO
// ===================================================

formMessage.className =
  "form-message success";

formMessage.innerHTML = `

  <div
    style="
      text-align:center;
      padding:20px;
    "
  >

    <h3>
      ✅ ¡Inscripción realizada correctamente!
    </h3>

    <p>
      Tu inscripción fue registrada.
    </p>

    <p>
      <strong>ID de inscripción</strong>
    </p>

    <p
      style="
        font-size:1.4rem;
        font-weight:700;
        margin:5px 0 15px;
      "
    >
      ${idParticipante}
    </p>


    <p>
      <strong>Estado:</strong>
      ${estado}
    </p>

    ${
      estado === "Lista de espera"
        ? `
          <p>
            <strong>
              Número en lista de espera:
            </strong>
            ${numeroListaEspera}
          </p>
        `
        : ""
    }


    <div
      style="
        margin:25px auto;
        display:flex;
        flex-direction:column;
        align-items:center;
      "
    >

      <p>
        <strong>
          Este es tu QR de ingreso
        </strong>
      </p>

      <div
        id="public-qr"
        style="
          background:#ffffff;
          padding:15px;
          display:inline-block;
          margin:10px 0;
        "
      ></div>

      <p
        style="
          font-size:0.8rem;
          margin-top:5px;
        "
      >
        Guardá este QR. Será tu identificación
        para el ingreso al campamento.
      </p>

    </div>


    <div
      style="
        display:flex;
        gap:10px;
        justify-content:center;
        flex-wrap:wrap;
        margin-top:20px;
      "
    >

      <button
        type="button"
        id="download-qr"
        class="button button-lime"
      >
        📥 Descargar QR
      </button>

      <button
        type="button"
        id="share-qr"
        class="button"
      >
        📤 Compartir QR
      </button>

    </div>

  </div>

`;


// ===================================================
// GENERAR QR
// ===================================================

if (
  qrContenido &&
  typeof QRCode !== "undefined"
) {

  const qrContainer =
    document.querySelector(
      "#public-qr"
    );

  new QRCode(
    qrContainer,
    {
      text: qrContenido,
      width: 220,
      height: 220,
      correctLevel:
        QRCode.CorrectLevel.H
    }
  );

}


// ===================================================
// DESCARGAR QR
// ===================================================

const downloadQR =
  document.querySelector(
    "#download-qr"
  );


if (downloadQR) {

  downloadQR.addEventListener(
    "click",
    () => {

      const qrContainer =
        document.querySelector(
          "#public-qr"
        );

      const canvas =
        qrContainer
          ? qrContainer.querySelector(
              "canvas"
            )
          : null;

      const image =
        qrContainer
          ? qrContainer.querySelector(
              "img"
            )
          : null;


      let url = "";


      if (canvas) {

        url =
          canvas.toDataURL(
            "image/png"
          );

      } else if (image) {

        url =
          image.src;

      }


      if (!url) {

        alert(
          "No se pudo generar el archivo QR."
        );

        return;

      }


      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `${idParticipante}-QR.png`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

    }
  );

}


// ===================================================
// COMPARTIR QR
// ===================================================

const shareQR =
  document.querySelector(
    "#share-qr"
  );


if (shareQR) {

  shareQR.addEventListener(
    "click",
    async () => {

      if (
        !navigator.share
      ) {

        alert(
          "Tu dispositivo no permite compartir directamente. Descargá el QR y compartilo desde la galería."
        );

        return;

      }


      try {

        const qrContainer =
          document.querySelector(
            "#public-qr"
          );

        const canvas =
          qrContainer
            ? qrContainer.querySelector(
                "canvas"
              )
            : null;


        if (!canvas) {

          throw new Error(
            "QR no disponible."
          );

        }


        const blob =
          await new Promise(
            resolve =>
              canvas.toBlob(
                resolve,
                "image/png"
              )
          );


        const file =
          new File(
            [
              blob
            ],
            `${idParticipante}-QR.png`,
            {
              type:
                "image/png"
            }
          );


        if (
          navigator.canShare &&
          navigator.canShare({
            files: [file]
          })
        ) {

          await navigator.share({

            title:
              `QR ${idParticipante}`,

            text:
              `Mi inscripción al Campamento CONECTADOS 2027. ID: ${idParticipante}`,

            files:
              [file]

          });

        } else {

          await navigator.share({

            title:
              `QR ${idParticipante}`,

            text:
              `Mi inscripción al Campamento CONECTADOS 2027. ID: ${idParticipante}`

          });

        }

      } catch (error) {

        console.error(
          "Error al compartir QR:",
          error
        );

      }

    }
  );

}


      formMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });


      // Limpiar formulario

      registrationForm.reset();


      // Restaurar edad

      updateAge();


      // Restaurar campos condicionales

      document
        .querySelectorAll(
          "[data-conditional]"
        )
        .forEach(select => {

          const target =
            document.getElementById(
              select.dataset.conditional
            );

          if (target) {
            target.hidden = true;
          }

        });


    } catch (error) {

      console.error(
        "ERROR COMPLETO:",
        error
      );


      formMessage.textContent =
        "No se pudo enviar la inscripción. " +
        error.message;


      formMessage.className =
        "form-message error";


      formMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });


    } finally {

      submitButton.disabled =
        false;

      submitButton.innerHTML =
        originalText;

    }

  });


// =========================================================
// INICIALIZAR
// =========================================================

updateAge();

console.log(
  "CONECTADOS 2027 - app.js inicializado correctamente"
);