function hammersley(n){
  let i=0;
  function next(){
    if(i>n){
      i=0
    }
    i++  
    return i/n;
  }
  return next;
}
function stratify(a,b,n){
  let i=0,j=0
  let x=a(),y=b();
  function next(){
    if(i>=n){
      i=0;
      j++;
    }
    if(j>=n){
      j=0;
      x=a();
      y=b();
    }
    let val=[(i+x)/n,(j+y)/n];
    i++;
    return val;
    
  }
  return next;
}
function halton(k){
  let arr=[0];
  let length=1;//标记上一次数组的长度
  let step=1/k,step2=1/k;//step2一直不变
  let n=k;
  let i=1;//1，...k
  let j=0;//0，1，2...length
  function next(){
    if(j>=length){//一重循环
      j=0;
      step+=step2;
      i++;
      //length=arr.length;
    }
    if(i>=k){
      j=0;
      i=1;
      n*=k;
      step2=1/n;
      step=1/n;
      length*=k;
    }
      let temp=arr[j]+step
      arr.push(temp)
      j++;
    return temp;
  }
  return next;
}