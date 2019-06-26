const fs = require('fs');

function generateDockerCompose(app_port, webgrind_port, location) {
    let content = "version: '3'\n" +
        "services:\n" +
        "  php_1111:\n" +
        "    container_name: \"php_1111\"\n" +
        "    build: .\n" +
        "    ports:\n" +
        "      - \"1111:80\"\n" +
        "    expose:\n" +
        "      - \"1111\"\n" +
        "    volumes:\n" +
        "      - stfiles1111:/tmp\n" +
        "      - srcfiles1111:/var/www/html\n" +
        "  webgrind_2222:\n" +
        "    container_name: \"webgrind_2222\"\n" +
        "    image: tbfisher/webgrind\n" +
        "    links:\n" +
        "      - php_1111\n" +
        "    volumes:\n" +
        "      - stfiles1111:/tmp\n" +
        "      - srcfiles1111:/var/www/html\n" +
        "    ports:\n" +
        "      - 2222:8080\n" +
        "    environment:\n" +
        "      XDEBUG_OUTPUT_DIR: /tmp\n" +
        "      WEBGRIND_STORAGE_DIR: /tmp\n" +
        "volumes:\n" +
        "  stfiles1111:\n" +
        "    driver: local\n" +
        "  srcfiles1111:\n" +
        "    driver: local\n";

    while(content.indexOf('1111') > -1) {
        content = content.replace('1111', app_port);
    }

    while(content.indexOf('2222') > -1) {
        content = content.replace('2222', webgrind_port);
    }

    fs.writeFile(location, content, () => {});
}

module.exports = generateDockerCompose;
