function torgb(str){
  let a=parseInt(str[1]+str[2],16);
  let b=parseInt(str[3]+str[4],16);
  let c=parseInt(str[5]+str[6],16);
  return [a/255,b/255,c/255];
}