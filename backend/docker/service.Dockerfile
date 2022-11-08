FROM python:latest
COPY . /backend
WORKDIR /backend
RUN pip install -r requirements.txt
EXPOSE 5000
COPY start-service.sh /backend/start-service.sh
RUN ["chmod", "+x", "/backend/start-service.sh"]
ENTRYPOINT ["sh","/backend/start-service.sh"]
