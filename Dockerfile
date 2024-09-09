# La siguiente linea viene de la documentación de playwright en la sección Docker. Es para descargar la imagen de Docker
# La versión debe coincidir con la versión de playwright usada en el proyecto
FROM mcr.microsoft.com/playwright:v1.46.1-noble
# Como docker está en blanco. Ose que no tiene ninguna estructura, se debe crear lo siguiente:
# Nombre de la carpeta a crear
RUN mkdir /app
# Se mueve a la carpeta creada en el paso anterior
WORKDIR /app
# Se copia el proyecto desde la ruta origen a la ruta destino.
# La ruta origen es la raíz del proyecto. Y como el archivo Dockerfile está creado en la raíz del proyecto, por eso se coloca un punto (.)
# La ruta destino es la carpeta que se creó con anterioridad
COPY . /app/
# Se ejecutan los siguietnes comandos para instalar el proyecto en el contenedor
RUN npm install --force
# Se ejecuta para instalar los navegadores en el contenedor
RUN npx playwright install
