// Déclarations pour les imports CSS
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Déclarations pour les imports SCSS/SASS
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.sass' {
  const content: Record<string, string>;
  export default content;
}

// Déclarations pour les images
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';