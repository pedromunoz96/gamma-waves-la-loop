# Free Shipping Bar (mp-free-shipping-bar)

Barra de progreso para el cart drawer que muestra cuánto le falta al cliente para
desbloquear el envío gratis. Cuando alcanza el umbral, muestra un mensaje de
"envío gratis desbloqueado".

Es 100% Liquid (renderizado en el servidor) + CSS. **No usa JavaScript**, no carga
scripts externos y no impacta el rendimiento.

---

## ¿Cómo funciona la lógica?

Todo ocurre en el bloque `{%- liquid -%}` al inicio del snippet:

1. **Filtro por país (opcional).**
   Solo se muestra si `localization.country.iso_code == 'US'`.
   Esto está pensado para una tienda con envío gratis solo en Estados Unidos.
   👉 Si tu proyecto aplica a todos los países, elimina esta condición (ver abajo).

2. **Lee el umbral** desde un setting global del tema:
   `settings.free_shipping_threshold`. Si es `0` (o no está configurado),
   el snippet **no renderiza nada**.

3. **Calcula el progreso** en centavos (Shopify maneja precios en centavos):
   - `threshold_cents = threshold * 100`
   - `remaining_cents = threshold_cents - cart.total_price`
   - Si `remaining_cents <= 0` → ya desbloqueó el envío gratis (`progress_pct = 100`).
   - Si no → `progress_pct = cart_total * 100 / threshold_cents` y se calcula
     `remaining_amount` (lo que falta) formateado con `money_without_trailing_zeros`.

4. **Renderiza** el mensaje + la barra. El ancho del relleno se controla con la
   variable CSS `--mp-shipping-progress`, que recibe el porcentaje calculado.

### ⚠️ Nota importante sobre la actualización
El cálculo es server-side, así que la barra se actualiza **cada vez que el cart
drawer se vuelve a renderizar** (al agregar/quitar productos, abrir el drawer, etc.),
que es el comportamiento normal en temas tipo Horizon. No se actualiza "en vivo" con
JS. Para la mayoría de tiendas esto es suficiente.

---

## Requisitos para implementarlo en otro proyecto

Este snippet depende de **3 cosas externas** que tienes que crear en el proyecto destino:

### 1. El setting del umbral (`config/settings_schema.json`)

Agrega este setting dentro de un grupo existente (idealmente el de Cart):

```json
{
  "type": "header",
  "content": "Free Shipping Bar"
},
{
  "type": "number",
  "id": "free_shipping_threshold",
  "label": "Free shipping threshold",
  "info": "Minimum order amount for free shipping (e.g. 150). Set to 0 to hide the bar.",
  "default": 0
}
```

Como es `settings.*` (global), queda editable desde:
**Theme editor → Theme settings → (grupo donde lo pusiste)**.

### 2. Las traducciones (`locales/*.json`)

El snippet usa dos strings con el namespace `content`. Agrégalos en cada idioma:

**`locales/en.default.json`**
```json
"content": {
  "free_shipping_progress": "You're {{ amount }} away from free shipping!",
  "free_shipping_unlocked": "You've unlocked free shipping!"
}
```

**`locales/es.json`**
```json
"content": {
  "free_shipping_progress": "¡Te faltan {{ amount }} para el envío gratis!",
  "free_shipping_unlocked": "¡Has desbloqueado el envío gratis!"
}
```

> Si no quieres usar traducciones, puedes reemplazar las llaves `{{ '...' | t }}`
> por texto directo, pero pierdes la editabilidad/multi-idioma.

### 3. Copiar el snippet y renderizarlo

1. Copia `mp-free-shipping-bar.liquid` a la carpeta `snippets/` del tema destino.
2. Renderízalo donde quieras que aparezca, típicamente dentro del cart drawer,
   justo después del header del drawer:

```liquid
{% render 'mp-free-shipping-bar' %}
```

En este proyecto está en `snippets/header-actions.liquid` (dentro del cart drawer).
En otros temas suele ir en `snippets/cart-drawer.liquid` o `sections/cart.liquid`.

---

## Variables CSS que usa (de Horizon)

El estilo hereda variables del tema. Si tu tema destino **no es Horizon**, ajusta o
define estas variables, o reemplázalas por valores fijos:

| Variable                  | Uso                                    |
|---------------------------|----------------------------------------|
| `--font-body--family`     | Tipografía del mensaje                 |
| `--font-body--style`      | Estilo de la tipografía                |
| `--color-foreground`      | Color del texto y del relleno de barra |
| `--color-foreground-rgb`  | Color de fondo del track (con opacidad)|

Ejemplo de fallback si tu tema no tiene esas variables:

```css
.mp-free-shipping-bar__message { color: #111; font-size: 11px; }
.mp-free-shipping-bar__track   { background-color: rgba(0,0,0,0.12); }
.mp-free-shipping-bar__fill    { background-color: #111; }
```

---

## Personalizaciones comunes

**Mostrar en todos los países (quitar el filtro de US):**
Elimina el bloque del `is_us` y cambia la condición final:

```liquid
{%- if threshold > 0 -%}
```

**Cambiar la moneda/formato:** el snippet ya usa `money_without_trailing_zeros`,
que respeta la moneda de la tienda automáticamente.

---

## Checklist de implementación

- [ ] Copiar `mp-free-shipping-bar.liquid` a `snippets/`
- [ ] Agregar el setting `free_shipping_threshold` a `settings_schema.json`
- [ ] Agregar las traducciones `content.free_shipping_progress` y `content.free_shipping_unlocked`
- [ ] Renderizar `{% render 'mp-free-shipping-bar' %}` dentro del cart drawer
- [ ] Configurar el umbral en el theme editor (poner un valor > 0)
- [ ] Verificar variables CSS (o agregar fallbacks si no usas Horizon)
- [ ] (Opcional) Quitar el filtro de país si aplica a toda la tienda
