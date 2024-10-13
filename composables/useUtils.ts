export const useUtils = () => {
  const sayHello = () => {
    console.log('Hello');
  };

  return {
    sayHello,
  };
};
