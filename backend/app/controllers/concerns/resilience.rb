module Resilience
  extend ActiveSupport::Concern

  included do
    around_action :with_resilience
  end

  def with_resilience(&block)
    # 1. Circuit Breaker
    if CircuitBreaker.open?
      render json: { error: 'Service Unavailable (Circuit Open)' }, status: :service_unavailable
      return
    end

    # 2. Timeout & 3. Retry
    retries = 0
    begin
      Timeout.timeout(5) do
        block.call
      end
      CircuitBreaker.record_success
    rescue Timeout::Error, ActiveRecord::ConnectionNotEstablished, Errno::ECONNREFUSED => e
      retries += 1
      if retries <= 3
        sleep(0.5)
        retry
      else
        CircuitBreaker.record_failure
        render json: { error: 'Request Timeout or Service Unavailable after retries' }, status: :service_unavailable
      end
    rescue StandardError => e
      # Record other unexpected failures if needed, but usually we just raise
      raise e
    end
  end
end

class CircuitBreaker
  @@failures = 0
  @@state = :closed
  @@last_failure_time = nil

  THRESHOLD = 3
  RESET_TIMEOUT = 10 # seconds

  def self.open?
    if @@state == :open
      if Time.now - @@last_failure_time > RESET_TIMEOUT
        @@state = :half_open
        return false
      else
        return true
      end
    end
    false
  end

  def self.record_success
    @@failures = 0
    @@state = :closed
  end

  def self.record_failure
    @@failures += 1
    if @@failures >= THRESHOLD
      @@state = :open
      @@last_failure_time = Time.now
    end
  end
end
